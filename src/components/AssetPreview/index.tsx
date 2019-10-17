import * as React from 'react'

import { FileDescription, StorageContext } from 'src/api/storage'

import './index.css'

interface AssetPreviewProps {
  asset: FileDescription,
  onClick?: (event: React.MouseEvent, asset: FileDescription) => void,
}

const KNOWN_MIME = ['image']

const AssetPreview = ({ onClick, asset }: AssetPreviewProps) => {
  const handleClick = (ev: React.MouseEvent) => {
    if (onClick) {
      onClick(ev, asset)
    }
  }

  const storage = React.useContext(StorageContext)

  let [type] = asset.mime.split('/', 1)
  if (!KNOWN_MIME.includes(type)) {
    type = 'unknown'
  }

  if (type === 'image') {
    return (
      <div
        className={"asset " + type}
        data-name={asset.name}
        onClick={handleClick}
      >
        <img className="asset__image" src={storage.mediaUrl(asset.name)} alt="" />
        <span className="asset__name">{asset.name}</span>
      </div>
    )
  }

  return (
    <div
      className={"asset " + type}
      data-name={asset.name}
      onClick={handleClick}
    >
      <span className="asset__name">{asset.name}</span>
      <span className="asset__mime">{asset.mime}</span>
    </div>
  )
}

export default AssetPreview
