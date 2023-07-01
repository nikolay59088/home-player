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
      artist: 'Автор 1',
      year: 2000,
      quality: 320,
      duration: 330,//'03:42',
      link: '/testSongs/testSong1.mp3',
      imgSong: ''
    },
    {
      name: 'Трек 1',
      album: 'Альбом2',
      artist: 'Автор 1',
      year: 2000,
      quality: 320,
      duration: 222,//'03:42',
      link: '/testSongs/testSong1.mp3',
      imgSong: ''
    },
    {
      name: 'Трек 1',
      album: 'Альбом3',
      artist: 'Автор 1',
      year: 2000,
      quality: 320,
      duration: 222,//'03:42',
      link: '/testSongs/testSong1.mp3',
      imgSong: ''
    }
  ]

  const clickTrack = (e: MouseEvent<HTMLTableRowElement>) => {

    let target = e.target as HTMLTableRowElement
  if (target.localName === 'td'){
    target = target.parentElement as HTMLTableRowElement
  }

  const foundObj = examplesTracks[target.rowIndex - 1]

    dispatch({
      type: UPDATE_PLAYER_STATUS,
      payload: {
        MPOpened: true,
        currentTrack: { ...foundObj}
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
                return <tr key={(row.name + row.album + row.artist).replaceAll(' ', '')} onClick={clickTrack}>
                  <td>{row.name}</td>
                  <td>{row.album}</td>
                  <td>{row.artist}</td>
                  <td>{row.year}</td>
                  <td>{'mp3 ' + row.quality}</td>
                  <td>{Math.floor(row.duration/60) + ':' + row.duration % 60}</td>
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
