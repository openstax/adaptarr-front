import * as React from 'react'
import * as PropTypes from 'prop-types'

import Storage, { FileDescription } from 'src/api/storage'

import './index.css'

interface AssetPreviewProps {
  asset: FileDescription,
  onClick?: (event: React.MouseEvent, asset: FileDescription) => void,
}

const KNOWN_MIME = ['image']

export default class AssetPreview extends React.Component<AssetPreviewProps> {
  static contextTypes = {
    storage: PropTypes.instanceOf(Storage),
  }

  render() {
    const { storage } = this.context
    const { asset } = this.props

    let [type] = asset.mime.split('/', 1)
    if (!KNOWN_MIME.includes(type)) {
      type = 'unknown'
    }

    let content
    switch (type) {
    case 'image':
      content =
                <>
                  <img className="asset__image" src={storage.mediaUrl(asset.name)} alt="" />
                  <span className="asset__name">{asset.name}</span>
                </>
      break

    default:
      content =
                <>
                  <span className="asset__name">{asset.name}</span>
                  <span className="asset__mime">{asset.mime}</span>
                </>
      break
    }

    return (
      <div
        className={"asset " + type}
        data-name={asset.name}
        onClick={this.onClick}
      >
        {content}
      </div>
    )
  }

  private onClick = (ev: React.MouseEvent) => {
    const { onClick, asset } = this.props

    if (onClick) {
      onClick(ev, asset)
    }
  }
}
