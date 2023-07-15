'use client'

import AlbumItem from "@/components/albumItem";
import styles from './page.module.scss'
import SearchAndFilter from '@/components/searchAndFilter'
import { ChangeEvent, useEffect, useState } from 'react'
import Loading from '@/components/loading'
import Pagination from '@/components/pagination'
import { UPDATE_HEADER_NAME, UPDATE_REFRESH_STATUS } from '@/store/constants.ts'
import { useAppContext } from '@/store'


type albumItemType = {
  name: string,
  id: number,
  album_artists_artist: {
    artist: {
      name: string
    }
  }[],
  song: {
    imgSong: string
  }[],
}

const Page = () => {

  const { state, dispatch } = useAppContext()
  const [albums, setAlbums] = useState({
    page: 1,
    allAlbums: 0,
    pagination: 15,
    albums: [],
    filter: ''
  })

  const [loading, setLoading] = useState(true)

  const acceptFilter = (filter: string) => {
    setAlbums({
      ...albums,
      filter: filter
    })
    setLoading(true)
  }

  useEffect(() => {
    dispatch({
      type: UPDATE_HEADER_NAME,
      payload: {
        menuName: 'Альбомы'
      }
    })
  }, [])

  useEffect(() => {

    if (state.songsRefreshed) {
      dispatch({
        type: UPDATE_REFRESH_STATUS,
        payload: {
          songsRefreshed: false
        }
      })
    }else{
      if (loading) {
        fetch(window.origin + `/api/music/albums/getAlbums?page=${albums.page}&pagination=${albums.pagination}&filter=${albums.filter}`)
          .then(result => result.json())
          .then(res => {
            setLoading(false)
            setAlbums({
              ...albums,
              albums: res.albums,
              allAlbums: res.allAlbums
            })
          })
      }
    }

  }, [albums.pagination, albums.page, albums.filter, state.songsRefreshed, loading])

  const changePagination = (e: ChangeEvent<HTMLSelectElement>) => {

    const target = e.target as HTMLSelectElement

    const newCountPages = Math.ceil(albums.allAlbums / Number(target.value))
    let newPage = albums.page

    if (newCountPages < newPage){
      newPage = 1
    }

    setAlbums({
      ...albums,
      pagination: Number(target.value),
      page: newPage
    })

    setLoading(true)
  }

  const changePage = (page: number) => {
    setAlbums({
      ...albums,
      page: page
    })
    setLoading(true)
  }


  return (
    <main className={styles.albumPageContainer}>
      <SearchAndFilter changeFilter={acceptFilter}/>
      <div className={styles.albumsContainer}>
      <div className={styles.albumSongsContainer}>
        {
          albums.albums.map((album: albumItemType) => {
            return <AlbumItem key={album.id} name={album.name} artists={album.album_artists_artist} albumLogo={album.song.length ? album.song[0].imgSong : '/images/album.svg'} idAlbum={album.id}/>
          })
        }

      </div>
      <Pagination
        pagination={albums.pagination}
        changePagination={changePagination}
        page={albums.page}
        changePage={changePage}
        allSongs={albums.allAlbums}
      />
      </div>
      {
        loading ? <Loading/> : null
      }

    </main>
  )
}

export default Page
