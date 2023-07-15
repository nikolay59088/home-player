import styles from '@/app/layout.module.scss'
import Header from '@/components/header'
import Player from '@/components/player'
import LeftMenu from '@/components/leftMenu'
import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <>
      <Header/>
      <div className={styles.mainContainer}>
        <LeftMenu/>
        {children}
      </div>
      <Player/>
    </>
  )
}
