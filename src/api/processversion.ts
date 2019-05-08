import axios from 'src/config/axios'

import Base from './base'
import Process, { ProcessStructure } from './process'

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
   * Return structure for this process.
   */
  async structure(): Promise<ProcessStructure> {
    if (this.structureData) return this.structureData

    const rsp = await axios.get(`processes/${this.process}/versions/${this.id}structure`)
    this.structureData = rsp.data
    return rsp.data
  }
}
