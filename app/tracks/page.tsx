'use client'

import styles from './page.module.scss'
import SearchAndFilter from '@/components/searchAndFilter'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { useAppContext } from '@/store'
import { UPDATE_HEADER_NAME, UPDATE_PLAYER_STATUS, UPDATE_REFRESH_STATUS } from '@/store/constants.ts'
import { currentTrackType } from '@/store/contextTypes.ts'
import Loading from '@/components/loading'
import Pagination from '@/components/pagination'
import Tag from '@/components/tag'

const Page = () => {

  const { state, dispatch } = useAppContext()

  const [song, setSongs] = useState({
    page: 1,
    allSongs: 0,
    pagination: 15,
    songs: [],
    filter: ''
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch({
      type: UPDATE_HEADER_NAME,
      payload: {
        menuName: 'Треки'
      }
    })
  }, [])

  useEffect(() => {

    if (state.songsRefreshed) {
      console.log('refreshed')
      dispatch({
        type: UPDATE_REFRESH_STATUS,
        payload: {
          songsRefreshed: false
        }
      })
    }else{
      if (loading) {
        fetch(window.origin + `/api/music/songs/getSongs?page=${song.page}&pagination=${song.pagination}&filter=${song.filter}`)
          .then(result => result.json())
          .then(res => {
            setLoading(false)
            setSongs({
              ...song,
              songs: res.songs,
              allSongs: res.allSongs
            })
          })
      }
    }

  }, [song.pagination, song.page, song.filter, state.songsRefreshed, loading])

  const clickTrack = async (e: MouseEvent<HTMLTableRowElement>) => {

    let target = e.target as HTMLTableRowElement
    if (target.localName === 'td'){
      target = target.parentElement as HTMLTableRowElement
    }

    const foundObj: currentTrackType = song.songs[target.rowIndex - 1]

    const songs = await fetch(window.origin + `/api/music/songs/getSongs?page=${song.page}&isPlaylist=true`)
    let songsJson = await songs.json()

    let dur = Math.floor(foundObj.duration || 0)
    let durMin = Math.floor(dur/60).toString()
    let durSec = (dur % 60).toString()

    while (durSec.length < 2){
      durSec = '0' + durSec
    }

    foundObj.duration = dur

    dispatch({
      type: UPDATE_PLAYER_STATUS,
      payload: {
        MPOpened: true,
        playlist: [...songsJson],
        currentTrackId: -1,
        currentTrack: foundObj,
        currentDuration: durMin + ':' + durSec,
        playing: true
      }
    })
  }

  const changePagination = (e: ChangeEvent<HTMLSelectElement>) => {

    const target = e.target as HTMLSelectElement

    const newCountPages = Math.ceil(song.allSongs / Number(target.value))
    let newPage = song.page

    if (newCountPages < newPage){
      newPage = 1
    }

    setSongs({
      ...song,
      pagination: Number(target.value),
      page: newPage
    })

    setLoading(true)
  }

  const changePage = (page: number) => {
    setSongs({
      ...song,
      page: page
    })
    setLoading(true)
  }

  const acceptFilter = (filter: string) => {
    setSongs({
      ...song,
      filter: filter
    })
    setLoading(true)
  }

  return (
          <main className={styles.tracksContainer}>
            <SearchAndFilter changeFilter={acceptFilter}/>
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
                        song.songs.map((row: currentTrackType)  => {
                          return <tr key={row.id} onClick={clickTrack}>
                            <td>{row.name}</td>
                            <td>{row.album.name}</td>
                            <td>{row.song_artists_artist.reduce((previousValue, currentValue) => previousValue + (previousValue.length ? ', ' : '') + currentValue.artist.name, '')}</td>
                            <td>{row.year}</td>
                            <td><Tag text={row.format + ' ' + row.quality} /></td>
                            <td>{Math.floor(row.duration/60) + ':' + ((row.duration % 60).toString().length === 1 ? '0' + row.duration % 60  : row.duration % 60)} </td>
                            <td></td>
                          </tr>
                        })
                      }
                </tbody>
              </table>
              <Pagination
                pagination={song.pagination}
                changePagination={changePagination}
                page={song.page}
                changePage={changePage}
                allSongs={song.allSongs}
              />
            </div>
            {
              loading ? <Loading/> : null
            }
          </main>
  )
}

export default Page
