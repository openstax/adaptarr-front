import * as React from 'react'

import { ModuleStatus } from 'src/store/types'

type Props = {
  data: ModuleStatus[]
}

const countRepeatedData = (data: string[]) => {
  let obj = {}

  for (let i = 0; i < data.length; i++) {
    if (obj[data[i]]) {
      obj[data[i]]++
    } else {
      obj[data[i]] = 1
    }
  }

  return obj
}

const stackedBar = ({ data }: Props) => {
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
              style={{width: `${val/total * 100}%`}}
              title={`${val} - ${el}`}
            ></span>
          )
        })
      }
    </span>
  )
}

export default stackedBar
