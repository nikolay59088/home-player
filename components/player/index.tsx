'use client'

import styles from './index.module.scss'
import { useAppContext } from '@/store'

const Player = () => {

  const { state } = useAppContext()

  if (!state.MPOpened){
    return <></>
  }

  return <section className={styles.playerContainer}>Player</section>
}

export default Player
