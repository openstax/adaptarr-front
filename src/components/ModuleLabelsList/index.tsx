import * as React from 'react'
import { useSelector } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { Link } from 'react-router-dom'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { createLabel } from 'src/store/actions/modules'
import { Labels, ModuleLabel as ModuleLabelType } from 'src/store/types'

import { getRandomColor } from 'src/helpers'

import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import './index.css'

interface ModuleLabelsListProps {
  active?: ModuleLabelType[]
  title?: string
  onLabelClick: (label: ModuleLabelType) => void
  onClose?: () => void
  [localizationProps: string]: any
}

const ModuleLabelsList = (
  { active = [], title, onLabelClick, onClose, ...localizationProps }: ModuleLabelsListProps
) => {
  const labels = useSelector((state: State) => state.modules.labels)
  const [filter, setFilter] = React.useState('')
  const regExp = new RegExp(filter, 'i')
  const filteredLabels = Object.values(labels).filter(label => label.name.match(regExp))

  const onChange = (text: string) => {
    setFilter(text)
  }

  const createNewLabel = () => {
    if (filter.length) {
      store.dispatch(createLabel({
        name: filter,
        color: getRandomColor(),
      }))
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', clickOutside)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', clickOutside)
    }
  }, [])

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && moduleLabelsList.current) {
      if (onClose) {
        onClose()
      }
    }
  }

  const clickOutside = (ev: MouseEvent) => {
    if (
      moduleLabelsList.current &&
      !moduleLabelsList.current.contains(ev.target as HTMLElement)
    ) {
      if (onClose) {
        onClose()
      }
    }
  }

  const moduleLabelsList = React.useRef<HTMLDivElement>(null)

  return (
    <div ref={moduleLabelsList} className="module-labels-list">
      <div className="module-labels-list__content">
        {
          title
            ? <span className="module-labels-list__title">
              <Localized id={title} {...localizationProps}>{title}</Localized>
            </span>
            : null
        }
        <Input
          onChange={onChange}
          autoFocus={true}
          l10nId="module-labels-list-filter"
        />
        {
          filteredLabels.length
            ? filteredLabels.map(label => (
              <LabelPresentation
                key={label.id}
                label={label}
                isActive={Boolean(active.find(l => l.id === label.id))}
                onClick={onLabelClick}
              />
            ))
            : filter.length === 0
              ?
              <span
                className="module-labels-list__item module-labels-list__item--no-hover"
              >
                <Localized id="module-labels-list-no-labels-found">
                No labels found
                </Localized>
              </span>
              : null

        }
        {
          filter.length && !filteredLabels.find(l => l.name.toLowerCase() === filter.toLowerCase())
            ?
            <span
              className="module-labels-list__item module-labels-list__item--center"
              onClick={createNewLabel}
            >
              <Localized id="module-labels-list-create-label" $name={filter}>
                {`Create new label: ${filter}`}
              </Localized>
            </span>
            : null
        }
      </div>
      <Link className="module-labels-list__item" to="/modules/labels">
        <Icon size="small" name="pencil"/>
        <Localized id="module-labels-list-edit-labels">
          Edit labels
        </Localized>
      </Link>
    </div>
  )
}

export default ModuleLabelsList

interface LabelPresentationProps {
  label: ModuleLabelType
  isActive: boolean
  onClick: (label: ModuleLabelType) => void
}

const LabelPresentation = ({ label, isActive, onClick }: LabelPresentationProps) => {
  const handleClick = () => {
    onClick(label)
  }

  return (
    <span
      className="module-labels-list__item"
      onClick={handleClick}
    >
      { isActive ? <Icon size="small" name="check-simple" /> : <span className="icon" /> }
      <span
        className="module-labels-list__color"
        style={{ backgroundColor: label.color }}
      />
      <span className="module-labels-list__name">
        {label.name}
      </span>
    </span>
  )
}
