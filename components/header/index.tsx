'use client'

import styles from './index.module.scss'
import { useState } from 'react'
import { useAppContext } from '@/store'
import { UPDATE_MENU_STATUS, UPDATE_REFRESH_STATUS } from '@/store/constants.ts'
import SvgRefresh from '@/public/images/refresh.svg'
import SvgProfile from '@/public/images/manage_accounts.svg'
import SvgMenu from '@/public/images/menu.svg'
import SvgError from '@/public/images/warning.svg'
import SvgLoading from '@/public/images/spinner.svg'



const Header = () => {

  const { state, dispatch } = useAppContext()

  const [refreshStatus, setRefreshStatus] = useState({
    type: 0,
    text: 'Обновить библиотеку'
  })

  const showHideMenu = () => dispatch({ type: UPDATE_MENU_STATUS, payload: { menuOpened: !state.menuOpened } })

  const refreshSongs = () => {

    setRefreshStatus({
      type: 1,
      text: 'Идет обновление библиотеки, подождите'
    })

    fetch(window.origin + `/api/music/songs/refresh`)
      .then(res => res.json())
      .then(result => {
        if (result.success){
          setRefreshStatus({
            type: 0,
            text: 'Обновить библиотеку'
          })

          dispatch({
            type: UPDATE_REFRESH_STATUS,
            payload: {
              songsRefreshed: true
            }
          })
        }else {
          setRefreshStatus({
            type: 2,
            text: 'Ошибка обновления'
          })
        }
      })
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftPartContainer}>
        <SvgMenu className={styles.menuImage} onClick={showHideMenu}/>

        <h4>{ state.menuName }</h4>
      </div>
      <div className={styles.rightPartContainer}>
        {
          refreshStatus.type === 0 ? <SvgRefresh title={refreshStatus.text} onClick={refreshSongs}/> :
          refreshStatus.type === 1 ? <SvgLoading title={refreshStatus.text}/> :
          refreshStatus.type === 2 ? <SvgError className={styles.warningSvg} title={refreshStatus.text} onClick={refreshSongs}/> : null
        }

        <SvgProfile/>
      </div>
    </header>
  )
}

export default Header
