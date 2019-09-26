import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import { Module, Team } from 'src/api'

import * as modulesActions from 'src/store/actions/Modules'
import { AlertDataKind } from 'src/store/types'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'

import confirmDialog from 'src/helpers/confirmDialog'
import getCurrentLng from 'src/helpers/getCurrentLng'

import LimitedUI from 'src/components/LimitedUI'
import ModulesList from 'src/components/ModulesList'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import './index.css'

export type ModulesPickerProps = {
  // Team in which new module will be created.
  team: Team | number
  // Show only modules from specific team.
  filterByTeam?: Team | number
  onModuleClick: (mod: Module) => any
  addModuleToMap: (mod: Module) => any
  removeModuleFromMap: (id: string) => any
  addAlert: (kind: AlertDataKind, message: string, args?: object) => void
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
    addModuleToMap: (mod: Module) => dispatch(modulesActions.addModuleToMap(mod)),
    removeModuleFromMap: (id: string) => dispatch(modulesActions.removeModuleFromMap(id)),
    addAlert: (kind: AlertDataKind, message: string, args: {}) => dispatch(addAlert(kind, message, args)),
  }
}

export type ModulesPickerState = {
  moduleTitleValue: string
  moduleLanguage: SelectOption
  files: File[]
  filterInput: string
}

class ModulesPicker extends React.Component<ModulesPickerProps> {
  state: ModulesPickerState = {
    moduleTitleValue: '',
    moduleLanguage: LANGUAGES.find(lng => lng.value === getCurrentLng('iso')) || LANGUAGES[0],
    files: [],
    filterInput: '',
  }

  private handleModuleClick = (mod: Module) => {
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
    const { team } = this.props
    const teamId = team instanceof Team ? team.id : team

    ;(files.length ? Module.createFromZip(title, files[0], teamId) : Module.create(title, lang.value, teamId))
      .then(mod => {
        this.props.onModuleClick(mod)
        this.props.addModuleToMap(mod)
        this.props.addAlert('success', 'module-list-add-module-alert-success', { title })
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

  private showRemoveModuleDialog = async (mod: Module) => {
    const res = await confirmDialog({
      title: 'module-list-delete-module-title',
      buttons: {
        cancel: 'module-list-delete-module-cancel',
        confirm: 'module-list-delete-module-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.removeModule(mod)
    }
  }

  private removeModule = (mod: Module) => {
    mod.delete()
      .then(() => {
        this.props.removeModuleFromMap(mod.id)
        this.props.addAlert('success', 'module-list-delete-module-alert-success', {title: mod.title})
      })
      .catch(e => {
        this.props.addAlert('error', e.message)
      })
  }

  private handleFilterInput = (val: string) => {
    if (val !== this.state.filterInput) {
      this.setState({ filterInput: val})
    }
  }

  public render() {
    const { moduleTitleValue, moduleLanguage } = this.state

    return (
      <div className="modulesList">
        <LimitedUI permissions="module:edit">
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
                  className="react-select"
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
                optional={true}
                multiple={false}
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
          team={this.props.team}
          filter={this.state.filterInput}
          onModuleClick={this.handleModuleClick}
          onModuleRemoveClick={this.showRemoveModuleDialog}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModulesPicker)
