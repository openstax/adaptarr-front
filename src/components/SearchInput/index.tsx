import * as React from 'react'
import { useSelector } from 'react-redux'

import { State } from 'src/store/reducers/'
import { ModuleLabel } from 'src/store/types'

import Input from 'src/components/ui/Input'

export type SearchQueries = {
  text: string
  label?: ModuleLabel | null
}

interface SearchInputProps {
  value?: SearchQueries
  placeholder?: string
  slowMode?: boolean
  onChange: (search: SearchQueries) => void
}

const SearchInput = ({ value, placeholder, slowMode = false, onChange }: SearchInputProps) => {
  const labels = useSelector((state: State) => state.modules.labels)

  // Used when slowMode === true
  let typingTimer: NodeJS.Timeout

  const handleChange = (input: string) => {
    if (slowMode) {
      clearTimeout(typingTimer)
    }

    // Match label:Name and label:"Name with spaces"
    const labelRgx = new RegExp(/label:(("|').+("|')|\w+)/, 'g')

    const result: SearchQueries = {
      text: input.replace(labelRgx, '').trim(),
    }

    const labelMatch = input.match(labelRgx)
    if (labelMatch) {
      const labelName = labelMatch[0].replace(/("|'|label:)/g, '').toLowerCase()
      const label = Object.values(labels).find(l => l.name.toLowerCase() === labelName) || null
      result.label = label
    }

    if (slowMode) {
      typingTimer = setTimeout(() => {
        onChange(result)
      }, 500)
    } else {
      onChange(result)
    }
  }

  const val = value
    ? `${value.text} ${value.label ? 'label:"' + value.label.name + '"' : ''}`.trim()
    : undefined

  return (
    <div className="search-input">
      <Input
        value={val}
        l10nId={placeholder}
        onChange={handleChange}
      />
    </div>
  )
}

export default SearchInput
