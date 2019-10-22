import * as React from 'react'

import { ModuleStatus } from 'src/store/types'

import './index.css'

interface StackedBarProps {
  data: ModuleStatus[]
}

const countRepeatedData = (data: string[]) => {
  const obj = {}

  for (let i = 0; i < data.length; i++) {
    if (obj[data[i]]) {
      obj[data[i]]++
    } else {
      obj[data[i]] = 1
    }
  }

  return obj
}

const StackedBar = ({ data }: StackedBarProps) => {
  const repeatedData = countRepeatedData(data)
  const total = data.length

  return (
    <span className="stacked">
      {
        Object.keys(repeatedData).map((el: string, index: number) => {
          const val = repeatedData[el]
          return (
            <span
              key={`${el}-${index}-${val}`}
              className={`stacked__bar stacked__bar--${el}`}
              style={{ width: `${val/total * 100}%` }}
              title={`${val} - ${el}`}
            >
              {val}
            </span>
          )
        })
      }
    </span>
  )
}

export default StackedBar
