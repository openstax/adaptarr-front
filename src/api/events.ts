import store from 'src/store'
import { addNotification } from 'src/store/actions/alerts'

export default class Events {
  private static instance: Events | null = null

  static create(): Promise<Events> {
    if (Events.instance == null) {
      Events.instance = new Events()
    }
    return Events.instance.promise
  }

  private socket: WebSocket

  private promise: Promise<Events>

  private constructor() {
    if (Events.instance != null) {
      throw new Error("Attempted to re-create Events")
    }

    const prefix = window.location.protocol === 'https:' || process.env.PRODUCTION ? 'wss' : 'ws'
    this.socket = new WebSocket(`${prefix}://${window.location.host}/api/v1/events`)

    this.socket.onclose = this.onClose
    this.socket.onmessage = this.onMessage

    this.promise = new Promise((resolve, reject) => {
      this.socket.onopen = event => {
        resolve(this)
        this.socket.onopen = this.onOpen
        this.onOpen(event)
      }

      this.socket.onerror = event => {
        reject(event)
        this.socket.onerror = this.onError
        this.onError(event)
      }
    })
  }


  onOpen = (event: Event) => {
    // console.log('opened connection', event)
  }

  onClose = (event: CloseEvent) => {
    // console.log('connection closed', event)
  }

  onError = (event: Event) => {
    console.error('connection error:', event)
  }

  onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    store.dispatch(addNotification(data))
  }
}
