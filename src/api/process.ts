import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import ProcessVersion from './processversion'
import { TeamID } from './team'
import { DraftData } from './draft'

import { elevated } from './utils'

/**
 * Process data.
 */
export type ProcessData = {
  id: number
  name: string
  version: string // date this version was created
  team: TeamID
}

/**
 * Process structure.
 */
export type ProcessStructure = {
  name: string,
  start: number,
  slots: ProcessSlot[],
  steps: ProcessStep[],
}

/**
 * Slot in process.
 */
export type ProcessSlot = {
  id: number,
  name: string,
  autofill: boolean,
  roles: number[],
}

/**
 * Step in process.
 */
export type ProcessStep = {
  id: number,
  name: string,
  slots: StepSlot[],
  links: Link[],
}

/**
 * Step's slot.
 */
export type StepSlot = {
  slot: number,
  permission: SlotPermission,
}

/**
 * Data for process step, but returned when request was for single step.
 */
export type ProcessSingleStep = {
  id: number,
  name: string,
  links: Link[],
  process: [number, number], // [ProcessID, VersionID]
  slots: SingleStepSlot[],
}

/**
 * Represent assignment of slots to steps.
 */
export type SingleStepSlot = {
  slot: number,
  permissions: SlotPermission[],
  user: number | null,
}

/**
 * Slot permissions.
 */
export type SlotPermission = 'view' | 'edit' | 'propose-changes' | 'accept-changes'

/**
 * Link data.
 */
export type Link = {
  name: string,
  to: number,
  slot: number,
}

/**
 * Free slot.
 */
export type FreeSlot = {
  id: number
  name: string
  draft: DraftData
}

export default class Process extends Base<ProcessData> {
  /**
   * Fetch data for specific process from the server.
   */
  static async load(id: number): Promise<Process> {
    const rsp = await axios.get(`processes/${id}`)
    return new Process(rsp.data)
  }

  /**
   * Fetch list of all processes.
   */
  static async all(): Promise<Process[]> {
    const processes = await axios.get('processes')
    return processes.data.map((p: ProcessData) => new Process(p))
  }

  /**
   * Create a new process.
   *
   * This function requires editing-process:edit permission.
   */
  static async create(structure: ProcessStructure, team: TeamID): Promise<Process> {
    const rsp = await elevated(() => axios.post('processes', { ...structure, team }))
    return new Process(rsp.data)
  }

  /**
   * Fetch list of all free slots which can be taken by current user.
   */
  static async freeSlots(): Promise<FreeSlot[]> {
    const rsp = await axios.get('processes/slots/free')
    return rsp.data
  }

  /**
   * Assign self to a free slot.
   */
  static takeSlot(data: { draft: string, slot: number }): Promise<AxiosResponse> {
    return axios.post('processes/slots', data)
  }

  /**
   * Process's id.
   */
  id: number

  /**
   * Process's name.
   */
  name: string

  /**
   * Version of process (data-time).
   */
  version: string

  /**
   * ID of team in for which this process was created.
   */
  team: TeamID

  /**
   * Structure of process.
   */
  structureData?: ProcessStructure

  /**
   * Fetch list of all versions of processes.
   */
  async versions(): Promise<ProcessVersion[]> {
    const versions = await axios.get(`processes/${this.id}/versions`)
    return versions.data.map((v: ProcessData) => new ProcessVersion(v, this.id))
  }

  /**
   * Return structure for this process. If @param fromCache is true then cached data
   * will be returned.
   */
  async structure(fromCache = true): Promise<ProcessStructure> {
    if (fromCache && this.structureData) return this.structureData
    const rsp = await axios.get(`processes/${this.id}/structure`)
    this.structureData = rsp.data
    return rsp.data
  }

  /**
   * Update name of process.
   *
   * This function requires editing-process:edit permission.
   */
  async updateName(name: string): Promise<Process> {
    const rsp = await elevated(() => axios.put(`processes/${this.id}`, { name }))
    return new Process(rsp.data)
  }

  /**
   * Update name or roles for slot in process.
   *
   * This function requires editing-process:edit permission.
   */
  updateSlot(slot: number, data: { name?: string, roles?: number[] }): Promise<AxiosResponse> {
    return elevated(() => axios.put(`processes/${this.id}/slots/${slot}`, data))
  }

  /**
   * Update name of step in process.
   *
   * This function requires editing-process:edit permission.
   */
  updateStepName(step: number, name: string): Promise<AxiosResponse> {
    return elevated(() => axios.put(`processes/${this.id}/steps/${step}`, { name }))
  }

  /**
   * Update name of link in process.
   *
   * This function requires editing-process:edit permission.
   */
  updateLinkName(step: number, slot: number, target: number, name: string): Promise<AxiosResponse> {
    return elevated(() => axios.put(
      `processes/${this.id}/steps/${step}/links/${slot}/${target}`,
      { name },
    ))
  }

  /**
   * Create new version of this process with updated structure.
   *
   * This function requires editing-process:edit permission.
   */
  async createVersion(structure: ProcessStructure): Promise<ProcessVersion> {
    const rsp = await elevated(() => axios.post(`processes/${this.id}/versions`, structure))
    return new ProcessVersion(rsp.data, this.id)
  }
}
