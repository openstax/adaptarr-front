import * as React from 'react'
import { Link } from 'react-router-dom'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import { Resource } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import FileUploader from 'src/containers/FilesUploader'

import { ACCEPTED_FILE_TYPES } from './../../index'

import './index.css'

type Props = {
  resource: Resource
  isEditingUnlocked: boolean
}

class ResourceCard extends React.Component<Props> {
  state: {
    showEditResource: boolean
    resourceName: string
    files: File[]
    isUploading: boolean
  } = {
    showEditResource: false,
    resourceName: this.props.resource.name,
    files: [],
    isUploading: false,
  }

  private showEditResource = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.setState({ showEditResource: true })
  }

  private closeEditResource = () => {
    this.setState({ showEditResource: false })
  }

  private editResource = async () => {
    this.setState({ isUploading: true })
    const { resourceName, files } = this.state
    const { resource } = this.props

    let promises = []
    if (resourceName !== resource.name) {
      promises.push(resource.changeName(resourceName))
    }

    if (files.length) {
      promises.push(resource.replaceContent(files[0]))
    }

    try {
      await Promise.all(promises)
      resource.name = resourceName
      store.dispatch(addAlert('success', 'resources-edit-success'))
    } catch (e) {
      store.dispatch(addAlert('error', 'resources-edit-error'))
    }

    this.setState({ showEditResource: false, resourceName, files: [], isUploading: false })
  }

  private handleResourceNameChange = (val: string) => {
    this.setState({ resourceName: val })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
  }

  private onFilesError = (error: FilesError, _: File) => {
    store.dispatch(addAlert('error', 'file-upload-error', { code: error.code }))
  }

  public render() {
    const { resource, isEditingUnlocked } = this.props
    const { showEditResource, resourceName, isUploading } = this.state

    const editingButton = isEditingUnlocked ?
        <div className="resource__buttons">
          <LimitedUI permissions="resources:manage">
            <Button clickHandler={this.showEditResource}>
              <Localized id="resources-card-edit">
                Edit
              </Localized>
            </Button>
          </LimitedUI>
        </div>
      : null

    return (
      <>
        {
          resource.kind === 'directory' ?
            <Link
              to={`/resources/${resource.id}`}
              className={`resource__card ${isEditingUnlocked ? 'resource__card--editing' : ''}`}
            >
              <div className="resource__content">
                <Icon size="big" name="folder" />
                <h2 className="resource__name">{resource.name}</h2>
                {editingButton}
              </div>
            </Link>
          :
            <Link
              to={`/api/v1/resources/${resource.id}/content`}
              target="_blank"
              className={`resource__card ${isEditingUnlocked ? 'resource__card--editing' : ''}`}
            >
              <div className="resource__content">
                <Icon size="big" name="file" />
                <h2 className="resource__name">{resource.name}</h2>
                {editingButton}
              </div>
            </Link>
        }
        {
          showEditResource ?
            <Dialog
              size="medium"
              l10nId="resources-card-edit-title"
              placeholder="Edit this resource"
              onClose={this.closeEditResource}
              showCloseButton={false}
            >
              {
                isUploading ?
                  <Spinner />
                :
                  <div className="resources__dialog-content">
                    <Input
                      l10nId="resources-name-placeholder"
                      value={resourceName}
                      onChange={this.handleResourceNameChange}
                      validation={{ minLength: 3 }}
                    />
                    {
                      resource.kind === 'file' ?
                        <FileUploader
                          onFilesChange={this.onFilesChange}
                          onFilesError={this.onFilesError}
                          multiple={false}
                          accepts={ACCEPTED_FILE_TYPES}
                          optional={true}
                        />
                      : null
                    }
                    <div className="dialog__buttons">
                      <Button clickHandler={this.closeEditResource}>
                        <Localized id="resources-edit-cancel">
                          Cancel
                        </Localized>
                      </Button>
                      <Button
                        clickHandler={this.editResource}
                        isDisabled={resourceName.length < 3}
                      >
                        <Localized id="resources-edit-update">
                          Update
                        </Localized>
                      </Button>
                    </div>
                  </div>
              }
            </Dialog>
          : null
        }
      </>
    )
  }
}

export default ResourceCard
