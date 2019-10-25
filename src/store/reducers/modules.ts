import { uuid } from 'cnx-designer'

import { sortRefTargets } from 'src/helpers'

import { Labels, ModulesMap, ModulesWithLabels, ReferenceTargets } from 'src/store/types'
import { ModulesAction } from 'src/store/actions/modules'
import {
  ADD_LABEL_TO_MODULE,
  ADD_MODULE_TO_MAP,
  CREATE_LABEL,
  REMOVE_LABEL,
  REMOVE_LABEL_FROM_MODULE,
  REMOVE_MODULE_FROM_MAP,
  SET_LABELS,
  SET_MODULES_MAP,
  SET_MODULES_WITH_LABELS,
  SET_REFERENCE_TARGETS,
  UPDATE_LABEL,
} from 'src/store/constants'

export interface State {
  labels: Labels
  modulesMap: ModulesMap
  modulesWithLabels: ModulesWithLabels
  referenceTargets: ReferenceTargets
}

export const initialState: State = {
  labels: {},
  modulesMap: new Map(),
  modulesWithLabels: {},
  referenceTargets: new Map(),
}

// eslint-disable-next-line default-param-last
export function reducer(state: State = initialState, action: ModulesAction): State {
  switch (action.type) {
  case SET_MODULES_MAP:
    return {
      ...state,
      modulesMap: action.data,
    }

  case ADD_MODULE_TO_MAP: {
    const modulesMapAfterAdd = state.modulesMap
    modulesMapAfterAdd.set(action.data.id, action.data)
    return {
      ...state,
      modulesMap: modulesMapAfterAdd,
    }
  }

  case REMOVE_MODULE_FROM_MAP: {
    const modulesMapAfterDel = state.modulesMap
    modulesMapAfterDel.delete(action.data)
    return {
      ...state,
      modulesMap: modulesMapAfterDel,
    }
  }

  case SET_REFERENCE_TARGETS: {
    const targets = new Map(state.referenceTargets)
    targets.set(action.data.moduleId, action.data.targets.sort(sortRefTargets))
    return {
      ...state,
      referenceTargets: targets,
    }
  }

  case CREATE_LABEL: {
    const label = action.data
    const labels = { ...state.labels }
    const id = uuid.v4()
    labels[id] = { id, ...label }
    localStorage.setItem('labels', JSON.stringify(labels))
    return {
      ...state,
      labels,
    }
  }

  case REMOVE_LABEL: {
    const id = typeof action.data === 'string' ? action.data : action.data.id
    const labels = { ...state.labels }
    const modulesWithLabels = { ...state.modulesWithLabels }
    delete labels[id]
    for (const [modId, labels] of Object.entries(modulesWithLabels)) {
      const index = labels.indexOf(id)
      if (index >= 0) {
        modulesWithLabels[modId] = labels.filter(l => l !== id)
      }
      if (modulesWithLabels[modId].length === 0) {
        delete modulesWithLabels[modId]
      }
    }
    localStorage.setItem('labels', JSON.stringify(labels))
    localStorage.setItem('modulesWithLabels', JSON.stringify(modulesWithLabels))
    return {
      ...state,
      labels,
      modulesWithLabels,
    }
  }

  case SET_LABELS:
    localStorage.setItem('labels', JSON.stringify(action.data))
    return {
      ...state,
      labels: action.data,
    }

  case UPDATE_LABEL: {
    const { id, data } = action.data
    const labels = { ...state.labels }
    labels[id] = { ...labels[id], ...data }
    localStorage.setItem('labels', JSON.stringify(action.data))
    return {
      ...state,
      labels,
    }
  }

  case SET_MODULES_WITH_LABELS:
    localStorage.setItem('modulesWithLabels', JSON.stringify(action.data))
    return {
      ...state,
      modulesWithLabels: action.data,
    }

  case ADD_LABEL_TO_MODULE: {
    const { module, label } = action.data
    const id = typeof label === 'string' ? label : label.id
    const modulesWithLabels = { ...state.modulesWithLabels }
    if (modulesWithLabels[module]) {
      const labels = modulesWithLabels[module]
      if (labels.indexOf(id) >= 0) return state
      modulesWithLabels[module] = labels.concat(id)
    } else {
      modulesWithLabels[module] = [id]
    }
    localStorage.setItem('modulesWithLabels', JSON.stringify(modulesWithLabels))
    return {
      ...state,
      modulesWithLabels,
    }
  }

  case REMOVE_LABEL_FROM_MODULE: {
    const { module, label } = action.data
    const id = typeof label === 'string' ? label : label.id
    const modulesWithLabels = { ...state.modulesWithLabels }
    const labels = modulesWithLabels[module]
    if (labels.length === 0) {
      delete modulesWithLabels[module]
    } else {
      modulesWithLabels[module] = labels.filter(lId => lId !== id)
    }
    localStorage.setItem('modulesWithLabels', JSON.stringify(modulesWithLabels))
    return {
      ...state,
      modulesWithLabels,
    }
  }

  default:
    return state
  }
}
