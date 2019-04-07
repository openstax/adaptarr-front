import * as React from 'react'
import Nestable from 'react-nestable'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import * as api from 'src/api'
import { PartData } from 'src/api/bookpart' 

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Spinner from 'src/components/Spinner'
import RemoteSource from './components/RemoteSource'

import RefTargets from 'src/containers/ReferenceTargets'

import { ModulesMap, ReferenceTarget, ReferenceTargets, BooksMap } from 'src/store/types'
import { State } from 'src/store/reducers'
import { fetchReferenceTargets } from 'src/store/actions/Modules'

import './index.css'

export type Props = {
  modules: ModulesMap,
  targets: ReferenceTargets,
  booksMap: BooksMap,
  /**
   * Function to call when user selects a resource target.
   */
  onSelect: (target: ReferenceTarget, source: null) => void,
  fetchReferenceTargets: (module: api.Module) => void,
}

const mapStateToProps = ({ modules: { modulesMap, referenceTargets }, booksMap: { booksMap } }: State) => ({
  modules: modulesMap,
  targets: referenceTargets,
  booksMap,
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
    const { onSelect } = this.props
    const { selected, books } = this.state
    const targets = selected ? this.props.targets.get(selected.id) : null

    if (targets != null) {
      return (
        <div className="remote-reference-targets">
          <Button clickHandler={this.unselectRefSource}>
            <Icon name="arrow-left" size="small" />
            <Localized id="reference-target-list-go-back">Back</Localized>
          </Button>
          <RefTargets
            module={selected}
            targets={targets}
            onSelect={onSelect}
          />
        </div>
      )
    }

    if (selected != null) {
      return (
        <div className="remote-reference-targets">
          <Spinner />
        </div>
      )
    }

    return (
      <div className="remote-reference-targets">
        {
          books.map(parts => (
            <Nestable
              key={parts.id}
              isDisabled={true}
              items={[parts]}
              className="book-collection"
              childrenProp="parts"
              renderItem={this.renderItem}
              renderCollapseIcon={this.renderCollapseIcon}
              collapsed
            />
          ))
        }
      </div>
    )
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

  private renderItem = ({ item, collapseIcon }: { item: PartData, index: number, collapseIcon: any, handler: any }) => {
    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <>
              <div className="bookpart__title">
                {item.title}
              </div>
              <span className="bookpart__icon">
                {collapseIcon}
              </span>
            </>
          : 
            <RemoteSource
              module={this.props.modules.get(item.id)!}
              onClick={this.selectRefSource}
            />
        }
      </div>
    )
  }

  private renderCollapseIcon = ({isCollapsed}: {isCollapsed: boolean}) => {
    if (isCollapsed) {
      return <Icon name="arrow-right"/>
    }

    return <Icon name="arrow-down" />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoteReferenceTargets)
