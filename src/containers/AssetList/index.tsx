import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Trans } from 'react-i18next'

import Storage, { FileDescription } from 'src/api/storage'

import AssetPreview from 'src/components/AssetPreview'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import mimeToRegExp from 'src/helpers/mimeToRegExp'

import './index.css'

export type Props = {
  filter?: string,
  onSelect?: (asset: FileDescription) => void,
}

export default class AssetList extends React.Component<Props> {
  static contextTypes = {
    storage: PropTypes.instanceOf(Storage),
  }

  constructor(a: any, b?: any) {
    super(a, b)

    this.fileInput = document.createElement('input')
    this.fileInput.type = 'file'
    this.fileInput.addEventListener('change', this.onFilesSelected)
  }

  fileInput: HTMLInputElement

  render() {
    const { storage } = this.context
    const pattern = mimeToRegExp(this.props.filter || '*/*')

    return (
      <ul className="assetList">
        <li className="assetList__item">
          <Button clickHandler={this.onAddMedia}>
            <Icon name="plus" />
            <Trans i18nKey="AssetList.addMedia" />
          </Button>
        </li>
        {storage.files
          .filter(({ mime }: FileDescription) => mime.match(pattern) !== null)
          .map((file: FileDescription) => (
            <li className="assetList__item">
              <AssetPreview
                key={file.name}
                asset={file}
                onClick={this.onClickAsset}
              />
            </li>
          ))
        }
      </ul>
    )
  }

  private onAddMedia = () => {
    this.fileInput.click()
  }

  // TODO: there should be some visual interface for previewing selected files
  // before upload, tracking upload progress, etc.
  private onFilesSelected = async () => {
    const { storage } = this.context

    try {
      await Promise.all(
        Array.from(this.fileInput.files!, file => storage.writeFile(file)))

      // XXX: Since Storage is mutable there's nothing we can update
      // in state to cause rerender, and thus we have to force it.
      this.forceUpdate()
    } catch (ex) {
      console.error(ex)
    }
  }

  private onClickAsset = (ev: React.MouseEvent, asset: FileDescription) => {
    const { onSelect } = this.props

    if (onSelect) onSelect(asset)
  }
}
