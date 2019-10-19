import * as React from 'react'

import { getRandomColor, isValidHex } from 'src/helpers'

import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import './index.css'

interface ColorGeneratorProps {
  startColor?: string
  onChange: (color: string) => void
}

const ColorGenerator = ({ startColor, onChange }: ColorGeneratorProps) => {
  const [color, setColor] = React.useState(startColor || getRandomColor())

  const newColor = () => {
    const color = getRandomColor()
    setColor(color)
    onChange(color)
  }

  const handleInput = (color: string) => {
    if (isValidHex(color)) {
      setColor(color)
      onChange(color)
    }
  }

  return (
    <div className="color-generator">
      <div
        className="color-generator__box"
        onClick={newColor}
        style={{ backgroundColor: color }}
      >
        <Icon size="small" name="refresh" />
      </div>
      <Input
        value={color}
        onChange={handleInput}
        validation={{
          custom: input => isValidHex(input),
        }}
      />
    </div>
  )
}

export default ColorGenerator
