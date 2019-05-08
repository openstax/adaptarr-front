import axios from 'src/config/axios'

import Base from './base'
import ProcessVersion from './processversion'

import { elevated } from './utils'

/**
 * Process data.
 */
export type ProcessData = {
  id: number,
  name: string,
  version: string, // date this version was created
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
  role: number | null,
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
 * Slot permissions.
 */
export type SlotPermission = 'View' | 'Edit' | 'ProposeChanges' | 'AcceptChanges'

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
  id: number,
  name: string,
  draft: {
    module: string,
    title: string,
  },
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
  static async create(structure: ProcessStructure): Promise<Process> {
    const rsp = await elevated(() => axios.post('processes', structure))
    return new Process(rsp.data)
  }

  /**
   * Fetch list of all free slots which can be taken by current user.
   */
  static async freeSlots(): Promise<FreeSlot[]> {
    const rsp = await elevated(() => axios.post('processes/slots/free'))
    return rsp.data
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
   * Return structure for this process.
   */
  async structure(): Promise<ProcessStructure> {
    if (this.structureData) return this.structureData

    const rsp = await axios.get(`processes/${this.id}/structure`)
    this.structureData = rsp.data
    return rsp.data
  }

  /**
   * Update name of process.
   * 
   * This function requires editing-process:edit permission.
   */
  async update(name: string): Promise<Process> {
    const rsp = await elevated(() => axios.post(`processes/${this.id}`, name))
    return new Process(rsp.data)
  }

  /**
   * Create new version of this process with updated structure.
   * 
   * This function requires editing-process:edit permission.
   */
  async createVersion(name: string): Promise<ProcessVersion> {
    const rsp = await elevated(() => axios.post(`processes/${this.id}`, name))
    return new ProcessVersion(rsp.data, this.id)
  }
}
