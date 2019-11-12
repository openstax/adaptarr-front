import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import './index.css'

interface CheckboxProps {
  label?: string
  value?: boolean
  onChange: (val: boolean) => void
}

const Checkbox = ({ label, value, onChange }: CheckboxProps) => {
  const [val, setVal] = React.useState(Boolean(value))

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = ev.currentTarget.checked
    setVal(newVal)
    onChange(newVal)
  }

  return (
    <label className="checkbox">
      {
        label
          ? <Localized id={label}>{label}</Localized>
          : null
      }
      <input type="checkbox" checked={val} onChange={handleChange} />
      <span className="checkbox__checkmark"/>
    </label>
  )
}

export default Checkbox
