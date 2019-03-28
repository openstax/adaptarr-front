import './index.css'

import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import * as api from 'src/api'
import getCurrentLng from 'src/helpers/getCurrentLng'

import LimitedUI from 'src/components/LimitedUI'
import ModulesList from 'src/components/ModulesList'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import * as modulesActions from 'src/store/actions/Modules'
import { RequestInfoKind } from 'src/store/types'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'

type Props = {
  onModuleClick: (mod: api.Module) => any
  addModuleToMap: (mod: api.Module) => any
  removeModuleFromMap: (id: string) => any
  addAlert: (kind: RequestInfoKind, message: string, args?: object) => void
}

type SelectOption = { value: string, label: string }

// value is an ISO tag for given language
const LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
]

const mapStateToProps = ({ modules }: State) => {
  return {
    modules,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addModuleToMap: (mod: api.Module) => dispatch(modulesActions.addModuleToMap(mod)),
    removeModuleFromMap: (id: string) => dispatch(modulesActions.removeModuleFromMap(id)),
    addAlert: (kind: RequestInfoKind, message: string) => dispatch(addAlert(kind, message)),
  }
}

class ModuleList extends React.Component<Props> {

  state: {
    moduleTitleValue: string
    moduleLanguage: SelectOption
    moduleToDelete: api.Module | null
    showRemoveModule: boolean
    files: File[]
    filterInput: string
  } = {
    moduleTitleValue: '',
    moduleLanguage: LANGUAGES.find(lng => lng.value === getCurrentLng('iso')) || LANGUAGES[0],
    moduleToDelete: null,
    showRemoveModule: false,
    files: [],
    filterInput: '',
  }

  private handleModuleClick = (mod: api.Module) => {
    this.props.onModuleClick(mod)
  }

  private updateModuleTitleValue = (val: string) => {
    this.setState({ moduleTitleValue: val })
  }

  private updateModuleLanguage = (lang: SelectOption) => {
    this.setState({ moduleLanguage: lang })
  }

  private addNewModule = (e: React.FormEvent) => {
    e.preventDefault()

    const { moduleTitleValue: title, files, moduleLanguage: lang } = this.state

    ;(files.length ? api.Module.createFromZip(title, files[0]) : api.Module.create(title, lang.value))
      .then(mod => {
        this.props.onModuleClick(mod)
        this.props.addModuleToMap(mod)
        this.props.addAlert('success', 'module-list-add-module-alert-success', {title: this.state.moduleTitleValue})
      })
      .catch(e => {
        this.props.addAlert('error', e.message)
      })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
  }

  private onFilesError = (error: FilesError, file: File) => {
    this.props.addAlert('error', error.message)
  }

  private showRemoveModuleDialog = (mod: api.Module) => {
    this.setState({ showRemoveModule: true, moduleToDelete: mod })
  }

  private closeRemoveModuleDialog = () => {
    this.setState({ showRemoveModule: false, moduleToDelete: null })
  }

  private removeModule = () => {
    const mod = this.state.moduleToDelete

    if (!mod) return

    mod.delete()
      .then(() => {
        this.props.removeModuleFromMap(mod.id)
        this.props.addAlert('success', 'module-list-delete-module-alert-success', {title: mod.title})
      })
      .catch(e => {
        this.props.addAlert('error', e.message)
      })
    this.closeRemoveModuleDialog()
  }

  private handleFilterInput = (val: string) => {
    if (val !== this.state.filterInput) {
      this.setState({ filterInput: val})
    }
  }

  public render() {
    const { moduleTitleValue, moduleLanguage, showRemoveModule } = this.state

    return (
      <div className="modulesList">
        {
          showRemoveModule ?
            <Dialog
              l10nId="module-list-delete-module-title"
              placeholder="Deleting module is permanent."
              onClose={this.closeRemoveModuleDialog}
            >
              <Button color="green" clickHandler={this.removeModule}>
                <Localized id="module-list-delete-module-confirm" />
              </Button>
              <Button color="red" clickHandler={this.closeRemoveModuleDialog}>
                <Localized id="module-list-delete-module-cancel" />
              </Button>
            </Dialog>
          : null
        }
        <LimitedUI flag="module:edit">
          <div className="modulesList__new">
            <form onSubmit={this.addNewModule}>
              <div className="modulesList__top-bar">
                <Input
                  l10nId="module-list-add-module-title"
                  value={moduleTitleValue}
                  onChange={this.updateModuleTitleValue}
                  validation={{minLength: 3}}
                />
                <Select
                  className="select"
                  value={moduleLanguage}
                  options={LANGUAGES}
                  onChange={this.updateModuleLanguage}
                />
                <Localized id="module-list-add-module-submit" attrs={{ value: true }}>
                  <input
                    type="submit"
                    value="Add new"
                    disabled={moduleTitleValue.length < 3 || !moduleLanguage}
                  />
                </Localized>
              </div>
              <FilesUploader
                onFilesChange={this.onFilesChange}
                onFilesError={this.onFilesError}
                accepts={['.zip', '.rar', '.cnxml']}
              />
            </form>
          </div>
        </LimitedUI>
        <div className="modulesList__filter">
          <Input
            l10nId="module-list-search-box"
            onChange={this.handleFilterInput}
          />
        </div>
        <ModulesList
          filter={this.state.filterInput}
          onModuleClick={this.handleModuleClick}
          onModuleRemoveClick={this.showRemoveModuleDialog}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModuleList)
