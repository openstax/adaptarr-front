import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Editor, Value } from 'slate'

import { FileDescription } from 'src/api/storage'

import ToolGroup from '../ToolGroup'
import AssetPreview from 'src/components/AssetPreview'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import AssetList from 'src/containers/AssetList'

import { OnToggle } from '../ToolboxDocument'

import './index.css'

interface MediaToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

type Action = 'add' | 'replace'

const MediaTools = ({ editor, value, toggleState, onToggle }: MediaToolsProps) => {
  const media = editor.getActiveMedia(value)
  const modal = React.useRef<Modal>(null)
  const [action, setAction] = React.useState<Action | null>(null)
  const [nodeToReplace, setNodeToReplace] = React.useState<string | null>(null)

  const onClickToggle = () => {
    onToggle('mediaTools')
  }

  const onAssetRemove = (key: string) => {
    editor.removeNodeByKey(key)
  }

  const onAssetClick = (key: string) => {
    setNodeToReplace(key)
    setAction('replace')
    modal.current!.open()
  }

  const onAddMediaNode = () => {
    setAction('add')
    modal.current!.open()
  }

  const addMediaNode = (asset: FileDescription) => {
    editor.insertNodeByKey(media!.key, media!.nodes.size - 1, Block.create({
      type: asset.mime.split('/', 1)[0],
      data: {
        src: asset.name,
        mime: asset.mime,
      },
    }))
    modal.current!.close()
  }

  const replaceMediaNode = (asset: FileDescription) => {
    editor.replaceNodeByKey(nodeToReplace!, Block.create({
      type: asset.mime.split('/', 1)[0],
      data: {
        src: asset.name,
        mime: asset.mime,
      },
    }))
    modal.current!.close()
  }

  const renderModal = () => (
    <AssetList
      onSelect={onSelect!}
    />
  )

  const onSelect = (asset: FileDescription) => {
    if (action === 'add') {
      addMediaNode(asset)
    } else if (action === 'replace') {
      replaceMediaNode(asset)
    }
  }

  return media && (
    <ToolGroup
      title="editor-tools-media-title"
      toggleState={toggleState}
      className="media-tools"
      onToggle={onClickToggle}
    >

      {
        media.nodes.map(node => {
          if (!node || node.object !== 'block' || node.type === 'media_alt') return null
          const mime = node.data.get('mime')
          const src = node.data.get('src')
          const onClick = () => {
            onAssetRemove(node.key)
          }
          const onReplaceAsset = () => {
            onAssetClick(node.key)
          }

          return (
            <div key={src} className="media-tools__asset">
              <Button
                className="media-tools__remove"
                clickHandler={onClick}
              >
                <Icon name="close" />
              </Button>
              <AssetPreview
                asset={{
                  mime,
                  name: src,
                }}
                onClick={onReplaceAsset}
              />
            </div>
          )
        })
      }
      <Button clickHandler={onAddMediaNode}>
        <Localized id="editor-tools-media-add">
          Add media file
        </Localized>
      </Button>
      <Modal
        ref={modal}
        content={renderModal}
      />
    </ToolGroup>
  )
}

export default MediaTools
