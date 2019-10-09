import * as React from 'react'
import Nestable from 'react-nestable'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import * as api from 'src/api'
import { PartData } from 'src/api/bookpart'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import RemoteSource from './components/RemoteSource'

import LocalizationLoader from 'src/screens/app/Draft/components/LocalizationLoader'

import RefTargets from 'src/containers/ReferenceTargets'

import { ModulesMap, ReferenceTarget, ReferenceTargets, BooksMap } from 'src/store/types'
import { State } from 'src/store/reducers'
import { fetchReferenceTargets } from 'src/store/actions/modules'

import './index.css'

export type Props = {
  modules: ModulesMap,
  targets: ReferenceTargets,
  booksMap: BooksMap,
  /**
   * Function to call when user selects a resource target.
   */
  onSelect: (target: ReferenceTarget | null, source: api.Module | null) => void,
  fetchReferenceTargets: (module: api.Module) => void,
  currentDraftLang: string,
}

const mapStateToProps = ({
  modules: { modulesMap, referenceTargets },
  booksMap: { booksMap },
  draft: { currentDraftLang } }: State) => ({
    modules: modulesMap,
    targets: referenceTargets,
    booksMap,
    currentDraftLang,
  })

const mapDispatchToProps = { fetchReferenceTargets }

/**
 * Display a list of reference targets located in any module.
 */
class RemoteReferenceTargets extends React.Component<Props> {
  state: {
    selected: api.Module | null,
    books: api.BookPart[]
  } = {
    selected: null,
    books: [],
  }

  private fetchBookparts = async () => {
    const books: api.BookPart[] = await Promise.all([...this.props.booksMap].map(([_, book]) => book.parts()))

    this.setState({ books })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.booksMap.size !== this.props.booksMap.size) {
      this.fetchBookparts()
    }
  }

  componentDidMount = () => {
    this.fetchBookparts()
  }

  render() {
    const { onSelect, currentDraftLang } = this.props
    const { selected, books } = this.state
    const targets = selected ? this.props.targets.get(selected.id) : null
    return (
      <>
        {
          targets && <div className="remote-reference-targets">
            <div className="remote-reference-targets__controls">
              <Button clickHandler={this.unselectRefSource}>
                <Icon name="arrow-left" size="small" />
                <Localized id="reference-target-list-go-back">Back</Localized>
              </Button>
              <Button clickHandler={this.selectModule}>
                <Localized id="reference-target-link-module">Link to this module</Localized>
              </Button>
            </div>
            <LocalizationLoader
              locale={currentDraftLang || 'en'}
            >
              <RefTargets
                module={selected}
                targets={targets}
                onSelect={onSelect}
              />
            </LocalizationLoader>
          </div>
        }
        <div className={`remote-reference-targets ${targets ? 'hide' : ''}`}>
          {
            books.map(parts => (
              <NestableCustomized
                key={parts.title + parts.number}
                parts={[parts]}
                modules={this.props.modules}
                onModuleClick={this.selectRefSource}
              />
            ))
          }
        </div>
      </>
    )
  }

  selectModule = () => {
    if (this.state.selected) {
      this.props.onSelect(null, this.state.selected)
    }
  }

  selectRefSource = (ev: React.MouseEvent) => {
    let target = ev.target as HTMLElement | null
    while (target && !target.dataset.id) {
      target = target.parentElement
    }

    if (!target) return

    const id = target.dataset.id!
    const { targets, modules, fetchReferenceTargets } = this.props
    const selected = modules.get(id)!

    this.setState({ selected })

    if (targets.get(id) == null) {
      fetchReferenceTargets(selected)
    }
  }

  unselectRefSource = () => this.setState({ selected: null })
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoteReferenceTargets)

const NestableCustomized = ({ parts, modules, onModuleClick }: { parts: api.BookPart[], modules: ModulesMap, onModuleClick: (ev: React.MouseEvent) => void }) => {
  const renderItem = ({ item, collapseIcon }: { item: PartData, index: number, collapseIcon: any, handler: any }) => {
    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <>
              <span className="bookpart__icon">
                {collapseIcon}
              </span>
              <div
                className="bookpart__title"
                onClick={() => nestable.current!.toggleCollapseGroup(item.number)}
              >
                {item.title}
              </div>
            </>
          :
            <RemoteSource
              module={modules.get(item.id)!}
              onClick={onModuleClick}
            />
        }
      </div>
    )
  }

  const renderCollapseIcon = ({isCollapsed}: {isCollapsed: boolean}) => {
    if (isCollapsed) {
      return <Icon name="arrow-right"/>
    }
    return <Icon name="arrow-down" />
  }

  const nestable = React.createRef<Nestable>()

  return (
    <Nestable
      ref={nestable}
      isDisabled={true}
      items={parts}
      className="book-collection"
      childrenProp="parts"
      renderItem={renderItem}
      renderCollapseIcon={renderCollapseIcon}
      collapsed
    />
  )
}
