import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import Process, { ProcessStructure, ProcessSlot, Link, ProcessSingleStep } from './process'

import { elevated } from './utils'

/**
 * Versions's data.
 */
export type VersionData = {
  id: number,
  name: string,
  version: string, // date this version was created
}

export default class ProcessVersion extends Base<VersionData> {
  /**
   * Fetch data for specific version of process from the server.
   */
  static async load(process: number, version: number): Promise<ProcessVersion> {
    const rsp = await axios.get(`processes/${process}/versions/${version}`)
    return new ProcessVersion(rsp.data, process)
  }

  /**
   * Version's id.
   */
  id: number

  /**
   * Version's name.
   */
  name: string

  /**
   * Version (data-time).
   */
  version: string

  /**
   * Structure of version.
   */
  structureData?: ProcessStructure

  /**
   * ID of the process this is a version of.
   */
  private process: number

  constructor(data: VersionData, process: Process | number) {
    super(data)

    this.process = process instanceof Process ? process.id : process
  }

  /**
   * Return structure for this version.
   */
  async structure(): Promise<ProcessStructure> {
    if (this.structureData) return this.structureData

    const rsp = await axios.get(`processes/${this.process}/versions/${this.id}/structure`)
    this.structureData = rsp.data
    return rsp.data
  }

  /**
   * Return list of slots for this version.
   */
  async slots(): Promise<ProcessSlot[]> {
    return (await axios.get(`processes/${this.process}/versions/${this.id}/slots`)).data
  }

  /**
   * Return informations about specific slot in this version.
   */
  async slot(slot: number): Promise<ProcessSlot> {
    return (await axios.get(`processes/${this.process}/versions/${this.id}/slots/${slot}`)).data
  }

  /**
   * Update name or roles for slot in version.
   *
   * This function requires editing-process:edit permission.
   */
  async updateSlot(slot: number, data: { name?: string, roles?: number[] }): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`processes/${this.process}/versions/${this.id}/slots/${slot}`, data))
  }

  /**
   * Return list of steps for this version.
   */
  async steps(): Promise<ProcessSingleStep[]> {
    return (await axios.get(`processes/${this.process}/versions/${this.id}/steps`)).data
  }

  /**
   * Return informations about specific step in this version.
   */
  async step(step: number): Promise<ProcessSingleStep> {
    return (await axios.get(`processes/${this.process}/versions/${this.id}/steps/${step}`)).data
  }

  /**
   * Update name of step in version.
   *
   * This function requires editing-process:edit permission.
   */
  async updateStepName(step: number, name: string): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`processes/${this.process}/versions/${this.id}/steps/${step}`, { name }))
  }

  /**
   * Return list of links for given step this version.
   */
  async links(step: number): Promise<Link[]> {
    return (await axios.get(`processes/${this.process}/versions/${this.id}/steps/${step}/links`)).data
  }

  /**
   * Return informations about link for given @param slot in @param step
   * which have target set to @param target in this version of process.
   */
  async link(step: number, slot: number, target: number): Promise<Link> {
    return (await axios.get(`processes/${this.process}/versions/${this.id}/steps/${step}/links/${slot}/${target}`)).data
  }

  /**
   * Update name of link in version.
   *
   * This function requires editing-process:edit permission.
   */
  async updateLinkName(step: number, slot: number, target: number, name: string): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`processes/${this.process}/versions/${this.id}/steps/${step}/links/${slot}/${target}`, { name }))
  }
}
