import { ReactNode } from 'react'
import styles from './layout.module.scss'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <div className={styles.imageContainer}>
      {children}
    </div>
    )
}
