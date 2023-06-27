'use client'

import Image from 'next/image'
import styles from './index.module.scss'
import { useAppContext } from '../../store'
import { UPDATE_MENU_STATUS } from '@/store/constants.ts'

const Header = () => {

  const { state, dispatch } = useAppContext()

  //() => dispatch({ type: UPDATE_HEADER_NAME, payload: { menuName: 'Обновленное меню' } })

  const showHideMenu = () => dispatch({ type: UPDATE_MENU_STATUS, payload: { menuOpened: !state.menuOpened } })

  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftPartContainer}>
        <Image
          className={styles.menuImage}
          onClick={showHideMenu}
          src='/images/menu.svg'
          alt='Меню'
          width={30}
          height={30}
        />
        <h4>{ state.menuName }</h4>
      </div>
      <div className={styles.rightPartContainer}>
        <Image
          className={styles.profileImage}
          src='/images/manage_accounts.svg'
          alt='Профиль'
          width={30}
          height={30}
        />
      </div>
    </header>
  )
}

export default Header