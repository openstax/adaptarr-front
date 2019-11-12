import * as React from 'react'
import { useSelector } from 'react-redux'

import { State } from 'src/store/reducers/'
import { ModuleLabel } from 'src/store/types'

import Spinner from 'src/components/Spinner'
import Input from 'src/components/ui/Input'

export type SearchQueries = {
  text: string
  label?: ModuleLabel | null
  mimeCategory?: string
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

    // Match mime:cat/
    const mimeCategoryRgx = new RegExp(/mime:(\w|\d)+\//, 'g')

    const result: SearchQueries = {
      text: input
        .replace(labelRgx, '')
        .replace(mimeCategoryRgx, '')
        .trim(),
    }

    const labelMatch = input.match(labelRgx)
    if (labelMatch) {
      const labelName = labelMatch[0].replace(/("|'|label:)/, '').toLowerCase()
      const label = Object.values(labels).find(l => l.name.toLowerCase() === labelName) || null
      result.label = label
    }

    const mimeCategoryMatch = input.match(mimeCategoryRgx)
    if (mimeCategoryMatch) {
      const mimeCategory = mimeCategoryMatch[0].replace(/mime:/, '').toLowerCase()
      result.mimeCategory = mimeCategory
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
    ? [
      value.label ? 'label:"' + value.label.name + '"' : '',
      value.mimeCategory ? 'mime:' + value.mimeCategory : '',
      value.text,
    ].join(' ').trim()
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
