'use client'

import styles from './page.module.scss'
import SearchAndFilter from '@/components/searchAndFilter'
import { MouseEvent } from 'react'
import { useAppContext } from '@/store'
import { UPDATE_PLAYER_STATUS } from '@/store/constants.ts'

const Page = () => {

  const { dispatch } = useAppContext()

  const examplesTracks = [
    {
      name: 'Трек 1',
      album: 'Альбом1',
      author: 'Автор 1',
      year: 2000,
      quality: 320,
      duration: '03:42'
    },
    {
      name: 'Трек 1',
      album: 'Альбом2',
      author: 'Автор 1',
      year: 2000,
      quality: 320,
      duration: '03:42'
    },
    {
      name: 'Трек 1',
      album: 'Альбом3',
      author: 'Автор 1',
      year: 2000,
      quality: 320,
      duration: '03:42'
    }
  ]

  const clickTrack = (e: MouseEvent<HTMLTableRowElement>) => {
    console.log(e)
    dispatch({ 
      type: UPDATE_PLAYER_STATUS, 
      payload: { 
        MPOpened: true 
      } 
    })
  }

  return (
    <main className={styles.tracksContainer}>
      <SearchAndFilter/>
      <div className={styles.tableListContainer}>
        <table className={styles.tableList}>
          <thead>
            <tr>
              <th>НАЗВАНИЕ</th>
              <th>АЛЬБОМ</th>
              <th>ИСПОЛНИТЕЛЬ</th>
              <th>ГОД</th>
              <th>КАЧЕСТВО</th>
              <th>ДЛИТЕЛЬНОСТЬ</th>
              <th>НАСТРОЙКИ</th>
            </tr>
          </thead>
          <tbody>
            {
              examplesTracks.map(row => {
                return <tr key={row.name + row.album + row.author} onClick={clickTrack}>
                  <td>{row.name}</td>
                  <td>{row.album}</td>
                  <td>{row.author}</td>
                  <td>{row.year}</td>
                  <td>{'mp3 ' + row.quality}</td>
                  <td>{row.duration}</td>
                  <td></td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Page