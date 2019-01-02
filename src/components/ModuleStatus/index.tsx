import './index.css'

import * as React from 'react'

import { ModuleStatus } from 'src/store/types'

type Props = {
  status: ModuleStatus
}

const ModuleStatus = ({ status }: Props) => (
  <span className={`moduleStatus moduleStatus--${status}`}>
    {status}
  </span>
)

export default ModuleStatus
