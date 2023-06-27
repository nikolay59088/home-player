'use client'

import { ReactNode, useState } from 'react'
import styles from './index.module.scss'
import Image from 'next/image'

type MenuGroupType = {
  text: string,
  icon: string,
  opened: boolean,
  children: ReactNode
}

const MenuGroup = ({ text, icon, opened = true, children }: MenuGroupType) => {

  const [state, setState] = useState({
    groupOpened: true
  })

  return (
    <div className={styles.menuGroupContainer + ' ' + (!opened ? styles.menuItemContainerClosed : '') }>
      <div
        className={styles.menuGroup}
        onClick={() => setState({ ...state, groupOpened: !state.groupOpened })}
      >
        <Image
          className={styles.imageItem}
          src={ state.groupOpened ? '/images/expand_more.svg' : `/images/${icon}.svg` }
          alt={text}
          width={25}
          height={25}
        />
        {
          opened ? <span>{text}</span> : null
        }
      </div>
      <div className={styles.childrenItemsContainer}>
        {state.groupOpened ? children : null}
      </div>

    </div>
  )
}

export default MenuGroup