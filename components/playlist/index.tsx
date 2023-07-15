'use client'

import styles from './index.module.scss'
import { currentTrackType, songArtist } from '@/store/contextTypes.ts'
import SvgClose from '@/public/images/close.svg'
import SvgEqualizer from '@/public/images/equalizer.svg'
import { useAppContext } from '@/store'
import React from 'react'
import { UPDATE_PLAYER_STATUS } from '@/store/constants.ts'

type PlaylistType = {
  list: currentTrackType[],
  currId: number,
  closePlaylist: () => void
}

const Playlist = ({ list, currId, closePlaylist }: PlaylistType) => {

  const { state, dispatch } = useAppContext()

  const getArtists = (artists: songArtist[]) => {
    let artistsRes = artists.reduce((accum, currentValue) =>
      accum + (accum.length ? ', ' : '') + currentValue.artist.name, '')

    return artistsRes.length > 20 ? artistsRes.substring(0, 17) + '...' : artistsRes
  }

  const changeSong = (idSong: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement

    let result = ''
    switch (target.localName){
    case 'p':{
      result = target.parentElement?.localName || ''
      break
    }
    case 'div':{
      result = target.localName
      break
    }
    case 'svg':{
      result = target.localName
      break
    }
    }

    if (result === 'div'){

      let foundSong = undefined
      for(let song of list){
        if (song.id === idSong){
          foundSong = song
          break
        }
      }

      if(foundSong !== undefined){
        dispatch({
          type: UPDATE_PLAYER_STATUS,
          payload: {
            currentTrack: foundSong
          }
        })
      }
    }else if (result === 'svg'){
      const newPlaylist = list.filter(elem => elem.id !== idSong)

      let currentTrack = state.currentTrack
      if (idSong === currentTrack?.id){
        for (let index in list){
          if (list[index].id === idSong){
            if (Number(index) < list.length - 1){
              currentTrack = list[Number(index) + 1]
            }else{
              currentTrack = list[0]
            }
          }
        }
      }

      dispatch({
        type: UPDATE_PLAYER_STATUS,
        payload: {
          playlist: newPlaylist,
          currentTrack: currentTrack
        }
      })
    }
  }


  return (
    <div className={styles.playlistContainer}>
      <div className={styles.playlistHeaderContainer}>
        <p>Плейлист / {list.length}</p>
        <div>
          <SvgClose onClick={closePlaylist}/>
        </div>
      </div>
      <div className={styles.playlistListContainer}>
        {
          list.map(song => {

            return <div className={styles.playlistListItem + ' ' + (song.id === currId ? styles.playlistListItemActive : '')} onClick={changeSong(song.id)}>
              {
                song.id === currId ? <SvgEqualizer className={styles.playlistCurrentPlayingSvg}/> : null
              }
              <p className={styles.hidden}>{song.id}</p>
              <p className={styles.playlistNameSong}>{song.name.length > 37 ? song.name.substring(0, 34) + '...' : song.name}</p>
              <p className={styles.playlistAuthorSong}>{getArtists(song.song_artists_artist)}</p>
              <SvgClose/>
            </div>
          })

        }
      </div>
    </div>
  )
}

export default Playlist
