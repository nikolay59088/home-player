'use client'

import styles from './index.module.scss'
import { useAppContext } from '@/store'
import Tag from '@/components/tag'
import { useEffect, useRef, useState } from 'react'
import SvgPrevious from '@/public/images/previous.svg'
import SvgPause from '@/public/images/pause.svg'
import SvgPlay from '@/public/images/play.svg'
import SvgNext from '@/public/images/next.svg'
import SvgClose from '@/public/images/close.svg'
import SvgVolumeUp from '@/public/images/volume_up.svg'
import SvgVolumeMute from '@/public/images/volume_mute.svg'
import SvgReorder from '@/public/images/reorder.svg'
import SvgPlaylist from '@/public/images/playlist_play.svg'
import { UPDATE_PLAYER_STATUS } from '@/store/constants.ts'
import { playAudio } from '@/lib/mediaSource.ts'
import { currentTrackType } from '@/store/contextTypes.ts'
import Playlist from '@/components/playlist'

const Player = () => {

  const { state, dispatch } = useAppContext()

  const [statePlayer, setStatePlayer] = useState({
    currentTime: '00:00',
    currentSec: 0,
    volume: 100,
    soundEnable: true,
    showPlaylist: false
  })

  const refAudio = useRef(null)
  const refPlaying = useRef(state.playing)

  useEffect(() => {

    if (state.MPOpened && state.currentTrackId != state.currentTrack?.id){

      //duration
      let dur = Math.floor(state.currentTrack?.duration || 0)
      let durMin = Math.floor(dur/60).toString()
      let durSec = (dur % 60).toString()

      while (durSec.length < 2){
        durSec = '0' + durSec
      }

      let songFound = null
      for(let songObj of state.playlist || []){
        if (state.currentTrackId === songObj.id){
          songFound = songObj
        }
      }

      fetch(window.origin + `/api/music/songs/getImageSong?id=${state.currentTrack?.id}`)
        .then(res => res.json())
        .then(jsonRes => {
          if (jsonRes.success){
            let elemAlbum = document.getElementById('albumLogo')
            elemAlbum?.setAttribute('src', jsonRes.data ? jsonRes.data : '/images/no-image.png')
          }
        })

      const audio = refAudio.current || new Audio
      audio.pause()
      audio.currentTime = 0

      playAudio(audio, state.currentTrack?.id || -1, state.playing || false)

      dispatch({
        type: UPDATE_PLAYER_STATUS,
        payload: {
          currentTrackId: state.currentTrack?.id,
          currentDuration: durMin + ':' + durSec,
        }
      })

    }
  }, [state.MPOpened, state.currentTrackId, state.currentTrack?.id])

  const timeUpdater = () => {

    const audio = refAudio.current || new Audio

    //console.dir(audio)

    let curr = Math.floor(audio.currentTime)
    let currMin = Math.floor(curr/60).toString()
    let currSec = (curr % 60).toString()

    while (currSec.length < 2){
      currSec = '0' + currSec
    }

    while (currMin.length < 2){
      currMin = '0' + currMin
    }

    setStatePlayer({
      ...statePlayer,
      currentTime: currMin + ':' + currSec,
      currentSec: curr,
    })
  }

  const loadedMetadata = () => {
    const audio = refAudio.current || new Audio
    //console.log(e)
    if (audio.duration === Infinity){
      audio.currentTime = 1e101
    }
  }

  const changeTime = (e: any) => {
    const audio = refAudio.current || new Audio
    audio.pause()
    audio.currentTime = e.target.value

    if (state.playing) {
      audio.play()
    }
  }

  const nextSong = () => {
    const audio = refAudio.current || new Audio
    console.log('song ended')
    audio.pause()
    audio.currentTime = 0
    setStatePlayer({ ...statePlayer, currentSec: 0, currentTime: '00:00' })

    let nextTrack: currentTrackType = {
      album: {
        id: -1,
        name: ''
      },
      albumId: 0,
      format: '',
      link: '',
      name: '',
      quality: 0,
      size: 0,
      song_artists_artist: [],
      trackNum: 0,
      year: 0,
      id: -1,
      duration: 0
    }
    state.playlist?.map((track, index) => {
      if (state.currentTrackId === track.id){
        if (index === ((state.playlist?.length || 1) - 1)){
          if ((state.playlist?.length || 1) > 1){
            nextTrack = state.playlist?.[0] as currentTrackType
          }
        }else{
          nextTrack = state.playlist?.[index + 1] as currentTrackType
        }
      }
    })

    dispatch({
      type: UPDATE_PLAYER_STATUS,
      payload: {
        playing: nextTrack.id !== -1,
        currentTrack: nextTrack,
        currentDuration: '--:--'
      }
    })
  }

  const previousSong = () => {
    const audio = refAudio.current || new Audio
    audio.pause()
    audio.currentTime = 0

    let nextTrack: currentTrackType = {
      album: {
        id: -1,
        name: ''
      },
      albumId: 0,
      format: '',
      link: '',
      name: '',
      quality: 0,
      size: 0,
      song_artists_artist: [],
      trackNum: 0,
      year: 0,
      id: -1,
      duration: 0
    }

    let indexFound = 0
    state.playlist?.map((track, index) => {
      if (state.currentTrackId === track.id){
        if (index === 0){
            nextTrack = state.playlist?.[0] as currentTrackType
        }else{
          nextTrack = state.playlist?.[index - 1] as currentTrackType
        }
        indexFound = index
      }
    })

    dispatch({
      type: UPDATE_PLAYER_STATUS,
      payload: {
        playing: nextTrack.id !== -1,
        currentTrack: nextTrack,
        currentDuration: indexFound !== 0 ? '--:--' : state.currentDuration
      }
    })
  }

  const pausePlaySong = () => {

    const audio = refAudio.current || new Audio
    if (state.playing){
      audio.pause()
    }else{
      audio.play()
    }

    console.log(state.playing)
    dispatch({
      type: UPDATE_PLAYER_STATUS,
      payload: {
        playing: !state.playing
      }
    })
  }

  const EnableSound = () => {
    const audio = refAudio.current || new Audio
    if (statePlayer.soundEnable){
      audio.volume = 0
    }else{
      audio.volume = statePlayer.volume / 100
    }

    setStatePlayer({
      ...statePlayer,
      soundEnable: !statePlayer.soundEnable
    })
  }

  const changeVolume = (e: any) => {

    const audio = refAudio.current || new Audio
    audio.volume = e.target.value / 100

    setStatePlayer({
      ...statePlayer,
      volume: e.target.value
    })
  }

  const closePlayer = () => {
    const audio = refAudio.current || new Audio

    audio.pause()
    audio.currentTime = 0
    refPlaying.current = false

    setStatePlayer({
      ...statePlayer,
      currentSec: 0,
      currentTime: ''
    })

    dispatch({
      type: UPDATE_PLAYER_STATUS,
      payload: {
        MPOpened: false,
        currentTrackId: -1,
        currentTrack: {
          id: -1,
          name: '',
          quality: 0,
          duration: 0,
          imgSong: '/images/no-image.png',
          size: 0,
          format: '',
          link: '',
          trackNum: 0,
          year: 0,
          album: {
            id: -1,
            name: ''
          },
          albumId: 0,
          song_artists_artist: []
        },
        currentDuration: '--:--',
        playlist: [],
        playing: false
      }
    })
  }


  const showHidePlaylist = () => {
    console.log('clicked')
    setStatePlayer({
      ...statePlayer,
      showPlaylist: !statePlayer.showPlaylist
    })
  }

  return <>
    {
    state.MPOpened ?
      <>
      {
        statePlayer.showPlaylist
          ?
        <Playlist
          list={state.playlist as currentTrackType[]}
          currId={state.currentTrack?.id || -1}
          closePlaylist={showHidePlaylist}
        />
          :
          null
      }
        <section className={styles.playerContainer}>
          <img id={'albumLogo'} src='/images/no-image.png' alt={'Обложка'} className={styles.imgSong}/>
          <div className={styles.infoSongContainer}>
            <div className={styles.nameSongContainer}>
              <span>{state.currentTrack?.name}</span>
              <Tag text={state.currentTrack?.quality.toString() || ''}/>
            </div>
            <span className={styles.albumSong}>{state.currentTrack?.album.name}</span>
            <div className={styles.songDurationContainer}>
              <span>{statePlayer.currentTime}</span>
              <input className={styles.rangeSlider} type='range' min={0} max={state.currentTrack?.duration} step='1' value={statePlayer.currentSec} onChange={changeTime}/>
              <span>{state.currentDuration}</span>
              <audio id='player' ref={refAudio} loop={false} muted={!statePlayer.soundEnable} onTimeUpdate={timeUpdater} onLoadedMetadata={loadedMetadata} onEnded={nextSong}></audio>
            </div>
            <div>
            </div>
          </div>
          <SvgPrevious title='Предыдущий трек' className={styles.audioControlImage} onClick={previousSong}/>
          {
            state.playing ?
              <SvgPause title='Пауза' className={styles.audioControlImage} onClick={pausePlaySong}/>
              :
              <SvgPlay title='Играть' className={styles.audioControlImage} onClick={pausePlaySong}/>
          }
          <SvgNext title='Следующий трек' className={styles.audioControlImage} onClick={nextSong}/>
          {
            statePlayer.soundEnable ?
              <SvgVolumeUp title='Громкость' className={styles.audioControlImage} onClick={EnableSound}/>
              :
              <SvgVolumeMute title='Громкость' className={styles.audioControlImage} onClick={EnableSound}/>
          }
          <div className={styles.volumeSongContainer}>
            <input className={styles.rangeSlider} type='range' min={0} max={100} step='1' value={statePlayer.volume && statePlayer.soundEnable ? statePlayer.volume : 0} onChange={changeVolume}/>
          </div>
          <SvgReorder className={styles.audioControlImage} title='По порядку'/>
          <SvgPlaylist className={styles.audioControlImage} title='Очередь воспроизведения' onClick={showHidePlaylist} />
          <span>{state.playlist?.length}</span>
          <SvgClose className={styles.audioControlImage} title='Закрыть' onClick={closePlayer}/>
        </section>
      </>

      : null
  }
  </>
}

export default Player
