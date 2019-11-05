import axios from 'src/config/axios'

import { leb128 } from 'src/containers/Chat/components/Message'

const ERR_UNSUPPORTED = 1003
const ERR_INVALID_HEADER = 4000
const ERR_UNKNOWN_EVENT = 4001

const MUST_PROCESS = 0x0001
const RESPONSE_REQUIRED = 0x0002

const CONNECTED = 0
const NEW_MESSAGE = 1
const SEND_MESSAGE = 2
const GET_HISTORY = 3
const USER_JOINED = 4
const UNKNOWN_EVENT = 0x8000
const MESSAGE_RECEIVED = 0x8001
const MESSAGE_INVALID = 0x8002
const HISTORY_ENTRIES = 0x8003

const TIMEOUT = 2000

const TYPES = {}

type ConnectedEventData = {}
;TYPES[CONNECTED] = {
  event: 'connected',

  parser(_: ArrayBuffer): ConnectedEventData {
    return {}
  },
}

export type NewMessageEventData = { id: number, time: Date, userId: number, message: MessageBody }
;TYPES[NEW_MESSAGE] = {
  event: 'newmessage',

  parser(body: Uint8Array, dv: DataView): NewMessageEventData {
    const metalen = dv.getUint16(0, true)
    const id = dv.getInt32(2, true)
    const userId = dv.getInt32(6, true)
    /* global BigInt - fix eslint error no-undef */
    const time = new Date(Number(dv.getBigInt64(10, true) * BigInt(1000)))
    const message = body.slice(metalen)

    return { id, time, userId, message }
  },
}

TYPES[UNKNOWN_EVENT] = {
  parser() {
    return new UnknownEventError()
  },
}

type MessageReceivedEventData = { id: number }
;TYPES[MESSAGE_RECEIVED] = {
  parser(_: Uint8Array, dv: DataView): MessageReceivedEventData {
    const id = dv.getUint32(0, true)
    return { id }
  },
}

TYPES[MESSAGE_INVALID] = {
  parser(body: Uint8Array) {
    const message = decode_utf8(body)
    return new MessageInvalidError(message)
  },
}

export type HistoryEntriesEventData = {
  before: (NewMessageEventData | UserJoinedEventData)[]
  after: (NewMessageEventData | UserJoinedEventData)[]
}

export interface ReplaceLoadingMessageData extends HistoryEntriesEventData {
  loadingMsgId: string
  isLoadingDone: boolean
  ref?: NewMessageEventData | UserJoinedEventData
}

TYPES[HISTORY_ENTRIES] = {
  event: 'historyentries',

  parser(body: Uint8Array, dv: DataView): HistoryEntriesEventData {
    const count_before = dv.getUint16(0, true)
    const count_after = dv.getUint16(2, true)
    const events = []

    let off = 4
    let type, length

    for (let i = 0 ; i < count_before + count_after ; ++i) {
      type = dv.getUint16(off, true)
      ;[length, off] = leb128(body, off + 2)

      const ebody = body.slice(off, off + length)
      const edv = new DataView(ebody.buffer, ebody.byteOffset, ebody.byteLength)
      events.push(TYPES[type].parser(ebody, edv))
      off += length
    }

    return {
      after: events.splice(count_before),
      before: events,
    }
  },
}

export type UserJoinedEventData = { id: number, date: Date, users: number[] }
;TYPES[USER_JOINED] = {
  event: 'userjoined',

  parser(body: Uint8Array, dv: DataView): UserJoinedEventData {
    const metalen = dv.getUint16(0, true)
    const id = dv.getInt32(2, true)
    const date = new Date(Number(dv.getBigInt64(10, true) * BigInt(1000)))
    const users = body.slice(metalen)

    return {
      id,
      date,
      users: Array.from(users).filter(usrId => usrId),
    }
  },
}

export type ConversationEventData =
  ConnectedEventData |
  NewMessageEventData |
  UnknownEventError |
  MessageReceivedEventData |
  MessageInvalidError |
  HistoryEntriesEventData

export type MessageBody = number[]|Uint8Array|ArrayBuffer

export type ConversationData = {
  id: number
  members: number[]
  // Messages id's that are already in state.messages for this conversation.
  knownMessages: Set<number>
}

export type Message = {
  id: number
  time: Date
  message: MessageBody
}

export type ConversationMessageKind =
  'message:user'
  | 'message:separator'
  | 'message:loading'
  | 'message:userjoined'

export type UserMessages = {
  kind: 'message:user'
  id: number
  userId: number
  messages: Message[]
}

export type DateSeparator = {
  kind: 'message:separator'
  date: Date
}

export type LoadingMessages = {
  kind: 'message:loading'
  id: string
  refId: number
  direction: 'before' | 'after'
}

export type UserJoined = {
  kind: 'message:userjoined'
  id: number
  date: Date,
  users: number[]
}

export type ConversationMessage =
  UserMessages
  | DateSeparator
  | LoadingMessages
  | UserJoined

export default class Conversation extends EventTarget {
  /**
   * Fetch conversation data by ID.
   */
  static async load(id: number): Promise<ConversationData> {
    const data = (await axios.get(`conversations/${id}`)).data
    return data
  }

  /**
   * Fetch list of all conversations.
   */
  static async all(): Promise<ConversationData[]> {
    const data = (await axios.get('conversations')).data
    return data
  }

  /**
   * Id of this conversation.
   */
  id: number

  /**
   * Mapping from cookies to promises for requests for which we are yet to
   * receive a response (and we require one).
   */
  _requests = new Map()

  /**
   * Value of the next cookie.
   */
  _cookie: number = 0

  /**
   * Cookie of currently processed event.
   */
  _event: number | null = null

  /**
   * Current WebSocket connection.
   */
  _ws: WebSocket | null = null

  onerror: any

  onclose: any

  onconnected: any

  onnewmessage: any

  constructor(id: number) {
    super()

    this.onerror = null
    this.onclose = null
    this.onconnected = null
    this.onnewmessage = null

    this.id = id
  }

  close() {
    this._ws!.close()
  }

  /**
   * Send an event.
   *
   * This low-level method allows you to send any event.
   *
   * @param {number} type - type of the event
   * @param {flags} flags - message flags
   * @param {number[]|Uint8Array|ArrayBuffer} body - body of the event
   */
  // eslint-disable-next-line consistent-return
  send(type: number, flags: number, body: MessageBody): Promise<any> | void {
    const cookie = this._getCookie()
    const msg = this._buildMessage(cookie, type, flags, body)

    this._ws!.send(msg)

    if (flags & RESPONSE_REQUIRED) {
      return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          this._ws!.close(4003)
          reject(new Error(`Timeouted after ${TIMEOUT}`))
        }, TIMEOUT)
        this._requests.set(cookie, { type, resolve, reject, timeout })
      })
    }
  }

  /**
   * Respond to an event
   *
   * This method can only be called from an event handler.
   *
   * @param {number} cookie - message to which to respond
   * @param {number} type - response type
   * @param {number[]|Uint8Array|ArrayBuffer} body - body of the response
   */
  respond(type: number, body: MessageBody) {
    if (this._event == null) {
      throw new Error("There is no event to respond to")
    }

    this._ws!.send(this._buildMessage(this._event, type, 0, body))
    this._event = null
  }

  /**
   * Add a new message to the conversation.
   *
   * @param {number[]|ArrayBuffer|Uint8Array} message - serialized message.
   */
  sendMessage(message: MessageBody): Promise<MessageReceivedEventData> {
    // eslint-disable-next-line max-len
    return this.send(SEND_MESSAGE, MUST_PROCESS | RESPONSE_REQUIRED, message) as Promise<MessageReceivedEventData>
  }

  /**
   * Get history messages from the conversation.
   *
   * @param {number} refEvent - ID of newest known event. Zero can be used
   * to request newest events.
   * @param {number} before - number of events which server should return before @param refEvent
   * @param {number} after - number of events which server should return after @param refEvent
   *
   * If @param refEvent was provided then it will be returned as a first event in after variable
   */
  async getHistory(
    refEvent: number,
    before: number,
    after: number
  ): Promise<HistoryEntriesEventData> {
    const body = new Uint8Array(8)
    const dv = new DataView(body.buffer)
    dv.setUint32(0, refEvent, true)
    dv.setUint16(4, before, true)
    dv.setUint16(6, after, true)
    const data = await this.send(GET_HISTORY, RESPONSE_REQUIRED, body) as HistoryEntriesEventData
    return data
  }

  /**
   * Establish connection.
   */
  async connect(): Promise<Conversation> {
    const data = (await axios(`conversations/${this.id}`)).data

    if (data.error != null) {
      const ev : CustomEvent<ConversationEventData> = new CustomEvent('error', { detail: data })
      this._dispatch(ev)
      throw ev
    }

    const prefix = window.location.protocol === 'https:' || process.env.PRODUCTION ? 'wss' : 'ws'
    const uri = `${prefix}://${window.location.host}/api/v1/conversations/${this.id}/socket`
    this._ws = new WebSocket(uri)
    this._ws.binaryType = 'arraybuffer'
    this._ws.onerror = this._onerror.bind(this)
    this._ws.onmessage = this._onmessage.bind(this)
    this._ws.onclose = this._onclose.bind(this)

    return new Promise((resolve, reject) => {
      this._ws!.onopen = () => {
        this._ws!.onopen = null
        resolve(this)
      }

      const error = (ev: CustomEvent<ConversationEventData>) => {
        this.removeEventListener('error', error)
        reject(ev)
      }

      this.addEventListener('error', error)
    })
  }

  _onerror(ev: CustomEvent<ConversationEventData>) {
    this._dispatch(new Event(ev.type, ev))
  }

  _onclose(ev: CustomEvent<ConversationEventData>) {
    this._dispatch(new CloseEvent(ev.type, ev))
  }

  /**
   * Process a message sent from the server.
   */
  _onmessage(ev: MessageEvent) {
    if (!(ev.data instanceof ArrayBuffer)) {
      this._ws!.close(ERR_UNSUPPORTED)
      return
    }

    if (ev.data.byteLength < 8) {
      this._ws!.close(ERR_INVALID_HEADER)
    }

    const dv = new DataView(ev.data)
    const cookie = dv.getUint32(0, true)
    const type = dv.getUint16(4, true)
    const flags = dv.getUint16(6, true)

    const body = new Uint8Array(ev.data, 8)
    const bodydv = new DataView(ev.data, 8)

    if ((cookie & 0x8000) === 0) {
      this._onresponse(cookie, type, body, bodydv)
      return
    }

    this._event = cookie

    const { event = null, parser = null } = TYPES[type] || {}

    if (parser == null) {
      console.error(`Received an unknown parser for type ${type}`)
      return
    }

    if (event == null) {
      if ((flags & MUST_PROCESS) !== 0) {
        this._ws!.close(ERR_UNKNOWN_EVENT)
      } else {
        this.respond(UNKNOWN_EVENT, [])
      }
      return
    }

    const data: ConversationEventData = parser(body, bodydv)

    this._dispatch(new CustomEvent(event, { detail: data }))
    this._event = null
  }

  /**
   * Process a response sent from the server.
   *
   * @param {number} cookie
   * @param {number} type
   * @param {Uint8Array} data
   * @param {DataView} dv
   */
  _onresponse(cookie: number, type: number, data: Uint8Array, dv: DataView) {
    const req = this._requests.get(cookie)
    this._requests.delete(cookie)

    if (req == null) {
      return
    }

    window.clearTimeout(req.timeout)

    const { parser = null } = TYPES[type] || {}

    if (parser == null) {
      console.error(`Received an unknown response ${type} for message ${req.type}`)
      return
    }

    const rsp = parser(data, dv)

    if (rsp instanceof Error) {
      req.reject(rsp)
    } else {
      req.resolve(rsp)
    }
  }

  /**
   * Generate a valid cookie.
   */
  _getCookie(): number {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const cookie = this._cookie++

      if (this._cookie >= 0x8000) {
        this._cookie = 0
        continue
      }

      if (!this._requests.has(cookie)) {
        return cookie
      }
    }
  }

  /**
   * Build a message from parts
   *
   * @param {number} cookie
   * @param {number} type
   * @param {number} flags
   * @param {number[]|Uint8Array|ArrayBuffer} body
   *
   * @return {Uint8Array}
   */
  _buildMessage(cookie: number, type: number, flags: number, body: MessageBody): Uint8Array {
    const msg = new Uint8Array(8 + (body instanceof ArrayBuffer ? body.byteLength : body.length))
    const dv = new DataView(msg.buffer)
    dv.setUint32(0, cookie, true)
    dv.setUint16(4, type, true)
    dv.setUint16(6, flags, true)
    msg.set(body as any, 8)
    return msg
  }

  /**
   * Dispatch an event
   */
  _dispatch(event: Event) {
    const handler = this['on' + event.type]

    if (handler != null) {
      handler.call(this, event)
    }

    this.dispatchEvent(event)
  }
}

/**
 * Error returned as a response when the server didn't understand our message.
 */
export class UnknownEventError extends Error {}

/**
 * Error returned as a response when the server rejected our message as invalid.
 */
export class MessageInvalidError extends Error {}

/**
 * Decode string from a sequence of UTF-8 bytes.
 *
 * @param {Uint8Array} data
 * @returns {String}
 */
function decode_utf8(data: Uint8Array): string {
  const text = []

  for (let inx = 0 ; inx < data.length ;) {
    const byte = data[inx++]
    let cp
    let len = 0

    if ((byte & 0x80) === 0) {
      cp = byte
    } else if ((byte & 0xe0) === 0xc0) {
      cp = byte & 0x1f
      len = 1
    } else if ((byte & 0xf0) === 0xe0) {
      cp = byte & 0x0f
      len = 2
    } else if ((byte & 0xf8) === 0xf0) {
      cp = byte & 0x07
      len = 3
    } else {
      throw new Error("Invalid UTF-8 start byte: " + byte)
    }

    for (let i = 0; i < len; ++i) {
      cp = (cp << 6) | (data[inx++] & 0x3f)
    }

    text.push(cp)
  }

  return String.fromCodePoint.apply(null, text)
}
