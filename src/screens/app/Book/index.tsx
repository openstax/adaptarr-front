import './index.css'

import * as React from 'react'
import Nestable from 'react-nestable'
import { History } from 'history'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'


import * as api from 'src/api'
import { PartData, GroupData, ModuleData } from 'src/api/bookpart'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import LimitedUI from 'src/components/LimitedUI'
import EditBook from 'src/components/EditBook'
import BookPartGroup from 'src/components/BookPartGroup'
import BookPartModule from 'src/components/BookPartModule'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import ModulePreview from 'src/containers/ModulePreview'
import ModulesPicker from 'src/containers/ModulesPicker'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  team: {
    teamMap: types.TeamMap
  }
  modules: {
    modulesMap: types.ModulesMap
  }
  addAlert: (kind: types.RequestInfoKind, message: string, args?: object) => void
}

const mapStateToProps = ({ team, modules }: State) => {
  return {
    team,
    modules,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addAlert: (kind: types.RequestInfoKind, message: string, args: Object) => dispatch(addAlert(kind, message, args)),
  }
}

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean
    book?: api.Book
    parts: api.BookPart[]
    showModuleDetails: api.Module | undefined
    showEditBook: boolean
    isEditingUnlocked: boolean
    groupNameInput: string
    showAddGroup: boolean
    showAddModule: boolean
  } = {
    isLoading: true,
    parts: [],
    showModuleDetails: undefined,
    showEditBook: false,
    isEditingUnlocked: false,
    groupNameInput: '',
    showAddGroup: false,
    showAddModule: false,
  }

  private showModuleDetails = (item: api.BookPart) => {
    if (item.kind === 'module' && item.id) {
      const details = this.props.modules.modulesMap.get(item.id)
      this.setState({ showModuleDetails: details })
    }
  }

  private closeModuleDetails = () => {
    this.setState({ showModuleDetails: undefined })
  }

  private renderItem = ({ item, collapseIcon }: { item: PartData, index: number, collapseIcon: any, handler: any }) => {
    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <BookPartGroup
              item={new api.BookPart((item as GroupData), this.state.book!)}
              book={this.state.book!}
              collapseIcon={collapseIcon}
              afterAction={this.fetchBook}
              isEditingUnlocked={this.state.isEditingUnlocked}
            />
          : <BookPartModule
              item={new api.BookPart((item as ModuleData), this.state.book!)}
              onModuleClick={this.showModuleDetails}
              afterAction={this.fetchBook}
              isEditingUnlocked={this.state.isEditingUnlocked}
            />
        }
      </div>
    )
  }

  private renderCollapseIcon = ({isCollapsed}: {isCollapsed: boolean}) => {
    if (isCollapsed) {
      return <Icon size="medium" name="arrow-right"/>
    }

    return <Icon size="medium" name="arrow-down" />
  }

  private findParentWithinItems = (items: api.BookPart[], path: number[]) => {
    let pathToParent = [...path]
    pathToParent.pop() // remove last index because it's pointing to changedItem

    let parent: api.BookPart

    if (pathToParent.length === 0) {
      parent = this.state.parts[0]
    } else {
      parent = items[pathToParent[0]]
      pathToParent.shift()

      // If there are still some indexes then process them
      if (pathToParent.length > 0) {
        pathToParent.forEach(index => {
          if (parent && parent.parts && parent.parts[index]) {
            parent = parent.parts[index]
          } else {
            throw new Error(`Couldn't find parent for item at path: ${JSON.stringify(path)}`)
          }
        })
      }
    }

    return parent
  }

  private handleOnMove = (newItems: api.BookPart[], changedItem: api.BookPart, realPathTo: number[]) => {
    // Do not move bookparts into modules
    // TODO: Create new part when user move module into module
    const parent: api.BookPart | api.Book = this.findParentWithinItems(newItems, realPathTo)

    if (typeof (parent as api.BookPart).number !== 'number') {
      console.log('You can not move items outside book.')
      return false
    } else if ((parent as api.BookPart).kind === 'module') {
      console.log('You can not move modules into modules.')
      return false
    }

    return true
  }

  private handlePositionChange = (newItems: api.BookPart[], changedItem: api.BookPart, realPathTo: number[]) => {
    const targetParent = this.findParentWithinItems(newItems, realPathTo)
    const targetPosition = {
      parent: targetParent.number,
      index: realPathTo[realPathTo.length - 1]
    }

    if (!(changedItem instanceof api.BookPart)) {
      // While processing data trough react-nestable, instances are lost,
      // so we have to recreate it
      // TODO: Adjust / rewrite react-nestable to handle instances properly

      const getPartData = (item: any): PartData | undefined => {
        let data: PartData
        if (item.kind === 'module') {
          data = {
            kind: 'module',
            number: item.number,
            title: item.title,
            id: item.id,
          }
        } else if (item.kind === 'group') {
          data = {
            kind: 'group',
            number: item.number,
            title: item.title,
            parts: item.parts.map((p: any) => getPartData(p)),
          }
        } else {
          return undefined
        }

        return data
      }

      const data = getPartData(changedItem)
      if (!data) return

      changedItem = new api.BookPart(data, this.state.book!)
    }

    changedItem.update(targetPosition)
      .then(() => {
        this.fetchBook()
        console.log({item: changedItem.title, target: targetParent.title})
        this.props.addAlert('success', 'book-part-moving-alert-success', {item: changedItem.title, target: targetParent.title})
      })
      .catch(e => {
        this.props.addAlert('error', e.message)
        this.fetchBook()
      })
  }

  private fetchBook = (id: string = this.props.match.params.id) => {
    api.Book.load(id)
      .then(book => {
        this.setState({ book })
        return book.parts()
          .then(parts => {
            this.setState({ isLoading: false, parts: [parts] })
          })
          .catch(e => {
            this.setState({ isLoading: false })
            this.props.addAlert('error', 'book-fetch-error', {title: book.title, details: e.message})
          })
      })
      .catch(() => {
        this.props.history.push('/404')
      })
  }

  private showEditBook = () => {
    this.setState({ showEditBook: true })
  }

  private closeEditBook = () => {
    this.setState({ showEditBook: false })
  }

  private handleEditBookSuccess = () => {
    this.setState({ showEditBook: false })
    this.fetchBook()
  }

  private toggleEditing = () => {
    this.setState({ isEditingUnlocked: !this.state.isEditingUnlocked })
  }

  private handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()

    const { book, groupNameInput, parts } = this.state
    const targetGroup = parts[0]

    if (!groupNameInput.length) {
      throw new Error("groupNameInput is undefined")
    }

    const payload = {
      title: groupNameInput,
      parent: targetGroup.number,
      index: targetGroup.parts ? targetGroup.parts.length : 0,
      parts: [],
    }

    book!.createPart(payload)
      .then(() => {
        this.fetchBook()
        this.props.addAlert('success', 'book-add-group-alert-success')
      })
      .catch((e) => {
        this.props.addAlert('error', e.message)
      })
    this.closeAddGroupDialog()
  }

  private showAddGroupDialog = () => {
    this.setState({ showAddGroup: true })
  }

  private closeAddGroupDialog = () => {
    this.setState({ showAddGroup: false })
  }

  private updateGroupNameInput = (val: string) => {
    this.setState({ groupNameInput: val })
  }

  private handleAddModule = (selectedModule: api.Module) => {
    const { book, parts } = this.state
    const targetGroup = parts[0]

    if (!selectedModule) {
      throw new Error("selectedModule is undefined")
    }

    const payload = {
      module: selectedModule.id,
      parent: targetGroup.number,
      index: targetGroup.parts ? targetGroup.parts.length : 0,
    }

    book!.createPart(payload)
      .then(() => {
        this.fetchBook()
        this.props.addAlert('success', 'book-group-add-module-alert-success', {
          title: selectedModule.title
        })
      })
      .catch((e) => {
        this.props.addAlert('error', e.message)
      })
    this.closeAddModuleDialog()
  }

  private handleModuleClick = (mod: api.Module) => {
    this.handleAddModule(mod)
  }

  private showAddModuleDialog = () => {
    this.setState({ showAddModule: true })
  }

  private closeAddModuleDialog = () => {
    this.setState({ showAddModule: false })
  }

  componentDidMount () {
    this.fetchBook()
  }

  public render() {
    const {
      isLoading,
      book,
      parts,
      showModuleDetails,
      isEditingUnlocked,
      showEditBook,
      showAddGroup,
      showAddModule,
      groupNameInput,
    } = this.state

    const title = book ? book.title : 'Loading'
    const titleKey = book ? 'book-view-title' : 'book-view-title-loading'

    return (
      <div className="container container--splitted">
        {
          showEditBook ?
            <EditBook
              book={book!}
              onClose={this.closeEditBook}
              onSuccess={this.handleEditBookSuccess}
            />
          : null
        }
        <Section>
          <Header l10nId={titleKey} title={title}>
            <LimitedUI permissions="book:edit">
              <Button clickHandler={this.toggleEditing}>
                {
                  isEditingUnlocked ?
                    <Icon size="medium" name="unlock" />
                  : <Icon size="medium" name="lock" />
                }
              </Button>
              {
                isEditingUnlocked ?
                  <Button
                    clickHandler={this.showEditBook}
                  >
                    <Icon name="pencil"/>
                  </Button>
                : null
              }
            </LimitedUI>
          </Header>
          {
            !isLoading ?
              <>
                <Nestable
                  isDisabled={!isEditingUnlocked}
                  items={parts[0].parts as api.BookPart[]}
                  className="book-collection"
                  childrenProp="parts"
                  renderItem={this.renderItem}
                  renderCollapseIcon={this.renderCollapseIcon}
                  onMove={this.handleOnMove}
                  onChange={this.handlePositionChange}
                  collapsed
                />
                {
                  isEditingUnlocked ?
                    <div className="book__controls">
                      <LimitedUI permissions="book:edit">
                        <Button clickHandler={this.showAddModuleDialog}>
                          <Localized id="book-button-add-module">
                            Add module
                          </Localized>
                        </Button>
                        <Button clickHandler={this.showAddGroupDialog}>
                          <Localized id="book-button-add-group">
                            Add group
                          </Localized>
                        </Button>
                      </LimitedUI>
                    </div>
                  : null
                }
              </>
            : <Spinner />
          }
        </Section>
        {
          showModuleDetails ?
            <Section>
              <Header>
                <Button to={`/modules/${showModuleDetails.id}`} withBorder={true}>
                  <Localized id="module-go-to">
                    Go to module
                  </Localized>
                </Button>
                <Button clickHandler={this.closeModuleDetails} className="close-button">
                  <Icon name="close" />
                </Button>
              </Header>
              <div className="section__content">
                <ModulePreview moduleId={showModuleDetails.id}/>
              </div>
            </Section>
          : null
        }
        {
          showAddGroup ?
            <Dialog
              l10nId="book-add-group-dialog-title"
              placeholder="Provide chapter title."
              size="medium"
              onClose={this.closeAddGroupDialog}
            >
              <form onSubmit={this.handleAddGroup}>
                <Input
                  l10nId="book-add-group-title"
                  onChange={this.updateGroupNameInput}
                  autoFocus
                  validation={{minLength: 3}}
                />
                <div className="dialog__buttons">
                  <Button clickHandler={this.closeAddGroupDialog}>
                    <Localized id="book-add-group-cancel">Cancel</Localized>
                  </Button>
                  <Localized id="book-add-group-confirm" attrs={{ value: true }}>
                    <input
                      type="submit"
                      value="Confirm"
                      disabled={groupNameInput.length <= 2}
                    />
                  </Localized>
                </div>
              </form>
            </Dialog>
          : null
        }
        {
          showAddModule ?
            <Dialog
              l10nId="book-group-add-module-dialog-title"
              placeholder="Select module or create a new one."
              size="medium"
              onClose={this.closeAddModuleDialog}
            >
              <ModulesPicker onModuleClick={this.handleModuleClick}/>
            </Dialog>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Book)
