import * as React from 'react'
import Select from 'react-select'
import { Block, Editor } from 'slate'
import { Localized } from 'fluent-react/compat'

import { isValidUrl } from 'src/helpers'

import Checkbox from 'src/components/ui/Checkbox'
import Input, { InputValue } from 'src/components/ui/Input'

import './index.css'

export type NodeBooleanAttr =
  'autoplay'
  | 'controller'
  | 'loop'

export type NodeStringAttr =
  'longdesc'
  | 'print-width'
  | 'standby'
  | 'thumbnail'

export type NodeNumberAttr = 'height' | 'volume' | 'width'

export type NodeSelectAttr = 'for'

const FOR_ATTR_OPTIONS = [
  { value: 'default', label: 'media-node-attr-for-default' },
  { value: 'online', label: 'media-node-attr-for-online' },
  { value: 'pdf', label: 'media-node-attr-for-pdf' },
]

export type NodeAttr =
  NodeBooleanAttr
  | NodeNumberAttr
  | NodeSelectAttr
  | NodeStringAttr

interface NodeAttributeProps {
  editor: Editor
  node: Block
  attribute: NodeAttr
}

const NodeAttribute = ({ editor, node, attribute }: NodeAttributeProps) => {
  let body: JSX.Element

  const updateNodeAttr = (attr: NodeAttr, val: boolean | number | string) => {
    editor.setNodeByKey(node.key, {
      type: node.type,
      data: node.data.set(attr, val),
    })
  }

  switch (attribute) {
  case 'autoplay': {
    const autoplay = node.data.get('autoplay')
    const onChange = (val: boolean) => {
      updateNodeAttr('autoplay', val)
    }
    body = (
      <Checkbox value={autoplay} label="node-attr-autoplay" onChange={onChange} />
    )
    break
  }

  case 'controller': {
    const controller = node.data.get('controller')
    const onChange = (val: boolean) => {
      updateNodeAttr('controller', val)
    }
    body = (
      <Checkbox value={controller} label="node-attr-controller" onChange={onChange} />
    )
    break
  }

  case 'for': {
    const forVal = node.data.get('for')
    const onChange = ({ value }: { value: string, label: string }) => {
      updateNodeAttr('for', value)
    }
    body = (
      <label>
        <Localized id="node-attr-for">
          For
        </Localized>
        <Select
          className="react-select"
          value={forVal ? { value: forVal, label: 'node-attr-for-' + forVal } : undefined}
          options={FOR_ATTR_OPTIONS}
          formatOptionLabel={OptionLabel}
          onChange={onChange}
        />
      </label>
    )
    break
  }

  case 'height': {
    const height = node.data.get('height')
    const onChange = (val: number) => {
      updateNodeAttr('height', val)
    }
    body = (
      <label>
        <Localized id="node-attr-height">
          Height
        </Localized>
        <Input
          type="number"
          value={height}
          onChange={onChange}
          validation={{
            custom: (val: InputValue) => !val || Boolean(Number(val)),
          }}
          errorMessage="node-attr-height-error"
        />
      </label>
    )
    break
  }

  case 'longdesc': {
    const longdesc = node.data.get('longdesc')
    const onChange = (val: string) => {
      if (!isValidUrl(val)) return
      updateNodeAttr('longdesc', val)
    }
    body = (
      <label>
        <Localized id="node-attr-longdesc">
          Longdesc
        </Localized>
        <Input
          value={longdesc}
          onChange={onChange}
          validation={{
            custom: (val: InputValue) => !val || Boolean(Number(val)),
          }}
          errorMessage="node-attr-longdesc-error"
        />
      </label>
    )
    break
  }

  case 'loop': {
    const loop = node.data.get('loop')
    const onChange = (val: boolean) => {
      updateNodeAttr('loop', val)
    }
    body = (
      <Checkbox value={loop} label="node-attr-loop" onChange={onChange} />
    )
    break
  }

  case 'print-width': {
    const printWidth = node.data.get('print-width')
    const onChange = (val: string) => {
      updateNodeAttr('print-width', val)
    }
    body = (
      <label>
        <Localized id="node-attr-print-width">
          Print width
        </Localized>
        <Input
          value={printWidth}
          onChange={onChange}
          validation={{
            custom: (val: string) => !val || /[0-9]+[a-z]+/.test(val),
          }}
          errorMessage="node-attr-print-width-error"
        />
      </label>
    )
    break
  }

  case 'standby': {
    const standby = node.data.get('standby')
    const onChange = (val: string) => {
      updateNodeAttr('standby', val)
    }
    body = (
      <label>
        <Localized id="node-attr-standby">
          Standby
        </Localized>
        <Input value={standby} onChange={onChange} />
      </label>
    )
    break
  }

  case 'thumbnail': {
    const thumbnail = node.data.get('thumbnail')
    const onChange = (val: string) => {
      if (!isValidUrl(val)) return
      updateNodeAttr('thumbnail', val)
    }
    body = (
      <label>
        <Localized id="node-attr-thumbnail">
          Thumbnail
        </Localized>
        <Input
          value={thumbnail}
          onChange={onChange}
          validation={{
            custom: (val: string) => !val || isValidUrl(val),
          }}
          errorMessage="node-attr-thumbnail-error"
        />
      </label>
    )
    break
  }

  case 'volume': {
    const volume = node.data.get('volume')
    const onChange = (val: number) => {
      if (0 < val && val <= 100) {
        updateNodeAttr('volume', val)
      }
    }
    body = (
      <label>
        <Localized id="node-attr-volume">
          Volume
        </Localized>
        <Input
          type="number"
          value={volume}
          onChange={onChange}
          validation={{
            custom: (val: InputValue) => !val || Boolean(Number(val) && 0 < val && val <= 100),
          }}
          errorMessage="node-attr-volume-error"
        />
      </label>
    )
    break
  }

  case 'width': {
    const width = node.data.get('width')
    const onChange = (val: number) => {
      updateNodeAttr('width', val)
    }
    body = (
      <label>
        <Localized id="node-attr-width">
          Width
        </Localized>
        <Input
          type="number"
          value={width}
          onChange={onChange}
          validation={{
            custom: (val: InputValue) => Boolean(Number(val)),
          }}
          errorMessage="node-attr-width-error"
        />
      </label>
    )
    break
  }

  default:
    return null
  }

  return (
    <div className="node-attr">
      {body}
    </div>
  )
}

export default NodeAttribute

function OptionLabel(op: { value: string, label: string } | undefined) {
  if (!op) return ''
  return <Localized id={op.label}>{op.label}</Localized> as unknown as string
}
