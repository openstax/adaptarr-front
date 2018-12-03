import * as React from 'react'

const icons = {
  menu: require('../../assets/icons/menu.svg'),
}

type Props = {
  name: 'menu' | 'arrow-left' | 'arrow-right',
}

const icon = (props: Props) => {
  const fileName = icons[props.name]

  return (
    <img src={fileName} />
  )
}

export default icon
