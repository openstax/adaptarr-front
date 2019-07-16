import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import Resource, { ResourceKind } from 'src/api/resource'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import LimitedUI from 'src/components/LimitedUI'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import ResourceCard from './components/ResourceCard'

import FileUploader from 'src/containers/FilesUploader'

import './index.css'

export const ACCEPTED_FILE_TYPES = [
  'application/*',
  'audio/*',
  'image/*',
  'text/*',
  'video/*',
]

type Props = {
  match: {
    params: {
      id: string
    }
  }
}

class Resources extends React.Component<Props> {
  state: {
    isLoading: boolean
    resources: Resource[]
    currentFolder: Resource | undefined
    isEditingUnlocked: boolean
    showAddResource: boolean
    resourceType: ResourceKind | null
    resourceName: string
    files: File[]
  } = {
    isLoading: true,
    resources: [],
    currentFolder: undefined,
    isEditingUnlocked: false,
    showAddResource: false,
    resourceType: null,
    resourceName: '',
    files: [],
  }

  private toggleEditing = () => {
    this.setState({ isEditingUnlocked: !this.state.isEditingUnlocked })
  }

  private showAddResource = () => {
    this.setState({ showAddResource: true })
  }

  private closeAddResource = () => {
    this.setState({ showAddResource: false, resourceName: '', resourceType: null, files: [] })
  }

  private handleResourceNameChange = (val: string) => {
    this.setState({ resourceName: val })
  }

  private addFolder = () => {
    this.setState({ resourceType: 'directory' })
  }

  private addFile = () => {
    this.setState({ resourceType: 'file' })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
  }

  private onFilesError = (error: FilesError, _: File) => {
    store.dispatch(addAlert('error', 'file-upload-error', { code: error.code }))
  }

  private addResource = async () => {
    const { resourceName, resourceType, files, currentFolder } = this.state

    let data: { name: string, parent?: string, file?: File } = {
      name: resourceName,
    }

    if (currentFolder) {
      data.parent = currentFolder.id
    }

    if (resourceType === 'file' && files[0]) {
      data.file = files[0]
    }

    await Resource.create(data).then(() => {
      store.dispatch(addAlert('success', 'resources-add-success'))
      this.fetchResources(this.props.match.params.id)
    }).catch(() => {
      store.dispatch(addAlert('error', 'resources-add-error'))
    })

    this.setState({ showAddResource: false, resourceName: '', resourceType: null, files: [] })
  }

  private fetchResources = async (parentId?: string) => {
    let resources = await Resource.all()
    let currentFolder = resources.find(r => r.id === parentId)
    if (parentId) {
      resources = resources.filter(r => r.parent && r.parent === parentId)
    } else {
      resources = resources.filter(r => !r.parent)
    }
    this.setState({ resources, isLoading: false, currentFolder })
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ isLoading: true, currentFolder: undefined })
      this.fetchResources(this.props.match.params.id)
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    this.setState({ isLoading: true })
    this.fetchResources(id)
  }

  public render() {
    const {
      isLoading,
      resources,
      currentFolder,
      isEditingUnlocked,
      showAddResource,
      resourceType,
      resourceName,
      files,
    } = this.state

    return (
      <Section>
        <Header l10nId={currentFolder ? undefined : "resources-view-title"} title="Resources">
          {
            currentFolder ?
              <h2 className="header__title">{currentFolder.name}</h2>
            : null
          }
          <LimitedUI permissions="resources:manage">
            <Button clickHandler={this.toggleEditing}>
              {
                isEditingUnlocked ?
                  <Icon size="medium" name="unlock" />
                : <Icon size="medium" name="lock" />
              }
            </Button>
            {
              isEditingUnlocked ?
                <Button clickHandler={this.showAddResource}>
                  <Icon size="medium" name="plus" />
                </Button>
              : null
            }
          </LimitedUI>
        </Header>
        <div className="section__content resources">
          {
            isLoading ?
              <Spinner />
            :
              resources.map(r => (
                <ResourceCard key={r.id} resource={r} isEditingUnlocked={isEditingUnlocked} />
              ))
          }
          {
            showAddResource ?
              <Dialog
                size="medium"
                l10nId="resources-add-title"
                placeholder="Add new resource"
                onClose={this.closeAddResource}
              >
                {
                  !resourceType ?
                    <div className="dialog__buttons">
                      <Button clickHandler={this.addFolder}>
                        <Localized id="resources-add-folder">
                          Add folder
                        </Localized>
                      </Button>
                      <Button clickHandler={this.addFile}>
                        <Localized id="resources-add-file">
                          Add file
                        </Localized>
                      </Button>
                    </div>
                  :
                    <div className="resources__dialog-content">
                      <Input
                        l10nId="resources-name-placeholder"
                        value={resourceName}
                        onChange={this.handleResourceNameChange}
                        validation={{ minLength: 2 }}
                      />
                      {
                        resourceType === 'file' ?
                          <FileUploader
                            onFilesChange={this.onFilesChange}
                            onFilesError={this.onFilesError}
                            multiple={false}
                            accepts={ACCEPTED_FILE_TYPES}
                          />
                        : null
                      }
                      <div className="dialog__buttons">
                        <Button clickHandler={this.closeAddResource}>
                          <Localized id="resources-add-cancel">
                            Cancel
                          </Localized>
                        </Button>
                        <Button
                          clickHandler={this.addResource}
                          isDisabled={resourceName.length < 3 || (resourceType === 'file' && !files[0])}
                        >
                          <Localized id="resources-add-confirm">
                            Confirm
                          </Localized>
                        </Button>
                      </div>
                    </div>
                }
              </Dialog>
            : null
          }
        </div>
      </Section>
    )
  }
}

export default Resources
