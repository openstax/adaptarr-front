import * as React from 'react'

import { ModuleStatus } from 'src/store/types'

import './index.css'

interface Props {
  status: ModuleStatus
}

const _ModuleStatus = ({ status }: Props) => (
  <span className={`moduleStatus moduleStatus--${status}`}>
    {status}
  </span>
)

export default _ModuleStatus
