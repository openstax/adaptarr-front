import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { FilesError } from 'react-files'

import i18n from 'src/i18n'
import sortArrayByTitle from 'src/helpers/sortArrayByTitle'
import * as api from 'src/api'

import AdminUI from 'src/components/AdminUI'
import ModulesList from 'src/components/ModulesList'
import ModuleInfo from 'src/components/ModuleInfo'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
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
  addAlert: (kind: RequestInfoKind, message: string) => void
}

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
    moduleToDelete: api.Module | null
    showRemoveModule: boolean
    files: File[]
    filterInput: string
  } = {
    moduleTitleValue: '',
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

  private addNewModule = () => {
    const { moduleTitleValue: title, files } = this.state

    ;(files.length ? api.Module.createFromZip(title, files[0]) : api.Module.create(title))
      .then(mod => {
        this.props.onModuleClick(mod)
        this.props.addModuleToMap(mod)
        this.props.addAlert('success', i18n.t("ModulesList.moduleAddSuccess", {title: this.state.moduleTitleValue}))
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
        this.props.addAlert('success', i18n.t("ModulesList.moduleRemoveSuccess", {title: mod.title}))
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
    const { moduleTitleValue, showRemoveModule } = this.state

    return (
      <div className="modulesList">
        {
          showRemoveModule ?
            <Dialog
              i18nKey="ModulesList.deleteModuleDialog"
              onClose={this.closeRemoveModuleDialog}
            >
              <Button color="green" clickHandler={this.removeModule}>
                <Trans i18nKey="Buttons.delete"/>
              </Button>
              <Button color="red" clickHandler={this.closeRemoveModuleDialog}>
                <Trans i18nKey="Buttons.cancel"/>
              </Button>
            </Dialog>
          : null
        }
        <AdminUI>
          <div className="modulesList__new">
            <div className="modulesList__top-bar">
              <Input
                placeholder={i18n.t("ModulesList.placeholderTitle")}
                value={moduleTitleValue}
                onChange={this.updateModuleTitleValue}
                validation={{minLength: 3}}
              />
              <Button 
                isDisabled={moduleTitleValue.length < 3}
                clickHandler={this.addNewModule}
              >
                <Icon name="plus"/>
                <Trans i18nKey="Buttons.addNew"/>
              </Button>
            </div>
            <FilesUploader
              onFilesChange={this.onFilesChange}
              onFilesError={this.onFilesError}
              accepts={['.zip', '.rar', '.cnxml']}
            />
          </div>
        </AdminUI>
        <div className="modulesList__filter">
          <Input
            onChange={this.handleFilterInput}
            placeholder={i18n.t("ModulesList.placeholderSearch")}
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
