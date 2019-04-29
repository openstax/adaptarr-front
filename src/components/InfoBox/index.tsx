import * as React from 'react'

import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  children: any
  onClose?: () => any
}

const InfoBox = ({ children, onClose }: Props) => {
  return (
    <div className="info-box">
      {children}
      {
        onClose ?
          <div className="info-box__close" onClick={onClose}>
            <Icon name="close" size="small"/>
          </div>
        : null
      }
    </div>
  )
}

export default InfoBox
