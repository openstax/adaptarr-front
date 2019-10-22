import * as React from 'react'

import Icon from 'src/components/ui/Icon'

import './index.css'

interface InfoBoxProps {
  children: any
  onClose?: () => any
}

const InfoBox = ({ children, onClose }: InfoBoxProps) => (
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

export default InfoBox
