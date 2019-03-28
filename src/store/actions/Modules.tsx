import Module from 'src/api/module'

import * as constants from 'src/store/constants'
import { ModulesMap, ReferenceTarget } from 'src/store/types'

export interface FetchModulesMap {
  (dispatch: any): void
}

export interface SetModulesMap {
  type: constants.SET_MODULES_MAP,
  data: ModulesMap,
}

export interface AddModuleToMap {
  type: constants.ADD_MODULE_TO_MAP,
  data: Module,
}

export interface RemoveModuleFromMap {
  type: constants.REMOVE_MODULE_FROM_MAP,
  data: string,
}

export interface SetAssigneeInModulesMap {
  type: constants.SET_ASSIGNE_IN_MODULES_MAP,
  data: {moduleId: string, assignee: number | null},
}

export interface SetAssignedToMe {
  type: constants.SET_ASSIGNED_TO_ME,
  data: Module[],
}

export interface FetchModulesAssignedToMe {
  (dispatch: any): void
}

export interface FetchReferenceTargets {
  (dispatch: any): void
}

export interface SetReferenceTargets {
  type: constants.SET_REFERENCE_TARGETS,
  data: {
    moduleId: string,
    targets: ReferenceTarget[],
  },
}

export type ModulesAction
  = SetModulesMap
  | AddModuleToMap
  | RemoveModuleFromMap
  | SetAssignedToMe
  | SetAssigneeInModulesMap
  | SetReferenceTargets

const setModulesMap = (payload: ModulesMap): SetModulesMap => {
  return {
    type: constants.SET_MODULES_MAP,
    data: payload,
  }
}

export const fetchModulesMap = (): FetchModulesMap => {
  return (dispatch: React.Dispatch<ModulesAction>) => {
    Module.all()
      .then(modules => {
        dispatch(setModulesMap(new Map(modules.map((mod: Module): [string, Module] => [mod.id, mod]))))
      })
      .catch(e => {
        console.log('fetchModulesMap():', e.message)
        throw new Error(e.message)
      })
  }
}

export const addModuleToMap = (payload: Module): AddModuleToMap => {
  return {
    type: constants.ADD_MODULE_TO_MAP,
    data: payload,
  }
}

export const removeModuleFromMap = (id: string): RemoveModuleFromMap => {
  return {
    type: constants.REMOVE_MODULE_FROM_MAP,
    data: id,
  }
}

export const setAssigneeInModulesMap = (moduleId: string, assignee: number | null): SetAssigneeInModulesMap => {
  return {
    type: constants.SET_ASSIGNE_IN_MODULES_MAP,
    data: {
      moduleId,
      assignee,
    },
  }
}

const setAssignedToMe = (modules: Module[]): SetAssignedToMe => {
  return {
    type: constants.SET_ASSIGNED_TO_ME,
    data: modules,
  }
}

export const fetchModulesAssignedToMe = (): FetchModulesAssignedToMe => {
  return (dispatch: React.Dispatch<ModulesAction>) => {
    Module.assignedTo('me')
      .then(modules => {
        dispatch(setAssignedToMe(modules))
      })
      .catch(e => {
        console.error('fetchModulesAssignedToMe():', e.message)
        throw new Error(e.message)
      })
  }
}

const setReferenceTargets = (moduleId: string, targets: ReferenceTarget[]): SetReferenceTargets => ({
  type: constants.SET_REFERENCE_TARGETS,
  data: {
    moduleId,
    targets,
  }
})

export const fetchReferenceTargets = (forModule: Module) => async (dispatch: any) => {
  const rsp = await forModule.referenceTargets()
  const targets = new Map<string, ReferenceTarget>()

  for (const rt of rsp) {
    if (rt.context) continue

    targets.set(rt.id, {
      id: rt.id,
      type: rt.type,
      description: rt.description,
      counter: rt.counter,
      children: [],
    })
  }

  for (const rt of rsp) {
    if (!rt.context) continue

    const context = targets.get(rt.context)
    if (!context) {
      console.warn(`Context ${rt.context} missing for element ${rt.id}, ignoring`)
      continue
    }

    context.children.push({
      id: rt.id,
      type: rt.type,
      description: rt.description,
      counter: rt.counter,
      children: [],
    })
  }

  dispatch(setReferenceTargets(forModule.id, Array.from(targets.values())))
}
