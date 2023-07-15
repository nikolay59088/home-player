import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import styles from './layout.module.scss'
import { AppWrapper } from '@/store'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Home music player',
  description: 'Created by Zatoplyaev N.A.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <html lang="ru" className={styles.htmlContainer}>
    <AppWrapper>
      <body className={inter.className + ' ' + styles.bodyContainer}>
      {children}
      </body>
    </AppWrapper>
    </html>
    )
}
