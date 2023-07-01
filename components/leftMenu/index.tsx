'use client'

import { useAppContext } from '@/store'
import styles from './index.module.scss'
import MenuItem from '@/components/menuItems/menuItem'
import MenuGroup from '@/components/menuItems/menuGroup'

const LeftMenu = () => {

  const { state } = useAppContext()

  const arrMenu = [
    {
      address: '',
      text: 'Альбомы',
      icon: 'album',
      children: [{
        address: '/albums',
        text: 'Все',
        icon: 'album'
      }]
    },
    {
      address: '/tracks',
      text: 'Треки',
      icon: 'music_note',
      children: []
    },
  ]


  return (
    <nav className={ state.menuOpened ? styles.leftMenuContainer : styles.leftMenuContainerClosed }>
      {
        arrMenu.map( elem => {
          return elem.children.length ?
            <MenuGroup key={elem.text} text={elem.text} icon={elem.icon} opened={state.menuOpened as boolean}>
              {
                elem.children.map( subElem => {
                  return <MenuItem key={subElem.address} address={subElem.address} text={subElem.text} icon={subElem.icon} opened={state.menuOpened as boolean}/>
                })
              }
            </MenuGroup>
            :
            <MenuItem key={elem.address} address={elem.address} text={elem.text} icon={elem.icon} opened={state.menuOpened as boolean}/>
        })
      }
    </nav>
  )
}

export default LeftMenu
