import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Storage, { FileDescription, StorageContext } from 'src/api/storage'
import { SlotPermission } from 'src/api/process'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { State } from 'src/store/reducers'

import AssetPreview from 'src/components/AssetPreview'
import SearchInput, { SearchQueries } from 'src/components/SearchInput'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface AssetListProps {
  onSelect?: (asset: FileDescription) => void,
  draftPermissions: SlotPermission[],
}

const mapStateToProps = ({ draft: { currentDraftPermissions } }: State) => ({
  draftPermissions: currentDraftPermissions,
})

interface AssetListState {
  search: SearchQueries
}

class AssetList extends React.Component<AssetListProps> {
  state: AssetListState = {
    search: {
      text: '',
    },
  }

  static contextType = StorageContext

  constructor(a: any, b?: any) {
    super(a, b)

    this.fileInput = document.createElement('input')
    this.fileInput.type = 'file'
    this.fileInput.addEventListener('change', this.onFilesSelected)
  }

  private handleSearch = (search: SearchQueries) => {
    this.setState({ search })
  }

  private filterAudio = () => {
    this.filterByMimeCategory('audio/')
  }

  private filterImages = () => {
    this.filterByMimeCategory('image/')
  }

  private filterVideos = () => {
    this.filterByMimeCategory('video/')
  }

  private filterAll = () => {
    this.setState({ search: { text: '' } })
  }

  private filterByMimeCategory = (cat: string) => {
    this.setState((state: AssetListState) => ({
      search: {
        ...state.search,
        mimeCategory: cat,
      },
    }))
  }

  fileInput: HTMLInputElement

  render() {
    const { search, search: { text, mimeCategory } } = this.state
    const storage: Storage = this.context
    const filteredFiles = storage.files.filter(({ name, mime }: FileDescription) => {
      if (mimeCategory && !mime.match(mimeCategory)) return false
      if (text && !name.toLowerCase().match(text.toLowerCase())) return false
      return true
    })

    return (
      <div className="assetList">
        <div className="assetList__controls">
          <SearchInput
            value={search}
            onChange={this.handleSearch}
            placeholder="asset-list-search-placeholder"
            slowMode={true}
          />
          <Button
            clickHandler={this.filterAll}
            className={!text && !mimeCategory ? 'active' : ''}
            withBorder={true}
          >
            <Localized id="asset-list-filter-all">
              All
            </Localized>
          </Button>
          <Button
            clickHandler={this.filterAudio}
            className={mimeCategory && mimeCategory.match('audio') ? 'active' : ''}
            withBorder={true}
          >
            <Localized id="asset-list-filter-audio">
              Audio
            </Localized>
          </Button>
          <Button
            clickHandler={this.filterImages}
            className={mimeCategory && mimeCategory.match('image') ? 'active' : ''}
            withBorder={true}
          >
            <Localized id="asset-list-filter-images">
              Images
            </Localized>
          </Button>
          <Button
            clickHandler={this.filterVideos}
            className={mimeCategory && mimeCategory.match('video') ? 'active' : ''}
            withBorder={true}
          >
            <Localized id="asset-list-filter-videos">
              Videos
            </Localized>
          </Button>
        </div>
        <ul className="assetList__list">
          <li className="assetList__item">
            <Button
              clickHandler={this.onAddMedia}
              isDisabled={!this.props.draftPermissions.includes('edit')}
            >
              <Icon size="medium" name="plus" />
              <Localized id="asset-list-add-media">Add media</Localized>
            </Button>
          </li>
          {filteredFiles
            .map((file: FileDescription) => (
              <li key={file.name} className="assetList__item">
                <AssetPreview
                  asset={file}
                  onClick={this.onClickAsset}
                />
              </li>
            ))}
        </ul>
      </div>
    )
  }

  private onAddMedia = () => {
    this.fileInput.click()
  }

  // TODO: there should be some visual interface for previewing selected files
  // before upload, tracking upload progress, etc.
  private onFilesSelected = async () => {
    const storage = this.context

    try {
      await Promise.all(
        Array.from(this.fileInput.files!, file => storage.writeFile(file)))

      // XXX: Since Storage is mutable there's nothing we can update
      // in state to cause rerender, and thus we have to force it.
      this.forceUpdate()
    } catch (ex) {
      store.dispatch(addAlert('error', 'asset-list-add-error', {
        details: ex.response.data.raw,
      }))
      console.error(ex)
    }
  }

  private onClickAsset = (ev: React.MouseEvent, asset: FileDescription) => {
    const { onSelect } = this.props

    if (onSelect) onSelect(asset)
  }
}

export default connect(mapStateToProps)(AssetList)
