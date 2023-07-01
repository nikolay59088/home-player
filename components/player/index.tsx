'use client'

import styles from './index.module.scss'
import { useAppContext } from '@/store'
import Tag from '@/components/tag'
import { MouseEvent, useEffect, useState } from 'react'
import SvgPrevious from '@/images/previous.svg'
import SvgPause from '@/images/pause.svg'
import SvgPlay from '@/images/play.svg'
import SvgNext from '@/images/next.svg'
import SvgClose from '@/images/close.svg'
import SvgVolumeUp from '@/images/volume_up.svg'
import SvgVolumeMute from '@/images/volume_mute.svg'
import SvgReorder from '@/images/reorder.svg'
import SvgPlaylist from '@/images/playlist_play.svg'
import { UPDATE_PLAYER_STATUS } from '@/store/constants.ts'

const Player = () => {

  const [statePlayer, setStatePlayer] = useState({
    currentTime: '00:00',
    currentSec: 0,
    durationTime: '',
    durationSec: 0,
    playing: false,
    volume: 100,
    soundEnable: true
  })

  const { state, dispatch } = useAppContext()

  useEffect(() => {

    if (state.MPOpened){
      let audioObj = document.getElementsByTagName('audio')[0]
      audioObj.pause()
      audioObj.currentTime = 0
      audioObj.play()
    }
    //duration
    let dur = Math.floor(state.currentTrack?.duration || 0)
    let durMin = Math.floor(dur/60).toString()
    let durSec = (dur % 60).toString()

    while (durSec.length < 2){
      durSec = '0' + durSec
    }

    setStatePlayer({
      ...statePlayer,
      durationSec: dur,
      durationTime: durMin + ':' + durSec,
      playing: true
    })
  }, [state.MPOpened, state.currentTrack?.name, state.currentTrack?.album, state.currentTrack?.duration])

  const timeUpdater = (e:  MouseEvent<HTMLAudioElement>) => {
    const target = e.target as HTMLAudioElement

    let curr = Math.floor(target.currentTime)
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

  const changeTime = (e: any) => {
    let audioObj = document.getElementsByTagName('audio')[0]
    audioObj.pause()
    audioObj.currentTime = e.target.value

    if (statePlayer.playing) {
      audioObj.play()
    }
  }

  const nextSong = () => {
    let audioObj = document.getElementsByTagName('audio')[0]
    console.log('music ended')
    audioObj.pause()
    audioObj.currentTime = 0
    setStatePlayer({ ...statePlayer, playing: false })
  }

  const previousSong = () => {
    let audioObj = document.getElementsByTagName('audio')[0]
    audioObj.pause()
    audioObj.currentTime = 0

    if (statePlayer.playing){
      audioObj.play()
    }
  }

  const pausePlaySong = () => {
    let audioObj = document.getElementsByTagName('audio')[0]
    if (statePlayer.playing){
      audioObj.pause()
    }else{
      audioObj.play()
    }
    setStatePlayer({ ...statePlayer, playing: !statePlayer.playing })
  }

  const EnableSound = () => {
    let audioObj = document.getElementsByTagName('audio')[0]
    if (statePlayer.soundEnable){
      audioObj.volume = 0
    }else{
      audioObj.volume = statePlayer.volume / 100
    }

    setStatePlayer({
      ...statePlayer,
      soundEnable: !statePlayer.soundEnable
    })
  }

  const changeVolume = (e: any) => {

    let audioObj = document.getElementsByTagName('audio')[0]
    audioObj.volume = e.target.value / 100

    setStatePlayer({
      ...statePlayer,
      volume: e.target.value
    })
  }

  const closePlayer = () => {
    let audioObj = document.getElementsByTagName('audio')[0]
    audioObj.currentTime = 0
    audioObj.pause()
    setStatePlayer({
      ...statePlayer,
      playing: false,
      durationSec: 0,
      durationTime: '',
      currentSec: 0,
      currentTime: ''
    })
    dispatch({
      type: UPDATE_PLAYER_STATUS, payload: {
        MPOpened: false,
        currentTrack: {
          name: '',
          artist: '',
          duration: 0,
          album: '',
          link: '',
          quality: 0,
          imgSong: '',
          year: 0
        }
      }
    })
  }

  return <>
    {
    state.MPOpened ? <section className={styles.playerContainer}>
      <img src={state.currentTrack?.imgSong} alt={'Обложка'} className={styles.imgSong}/>
      <div className={styles.infoSongContainer}>
        <div className={styles.nameSongContainer}>
          <span>{state.currentTrack?.name}</span>
          <Tag text={state.currentTrack?.quality.toString() || ''}/>
        </div>
        <span className={styles.albumSong}>{state.currentTrack?.album}</span>
        <div className={styles.songDurationContainer}>
          <span>{statePlayer.currentTime}</span>
          <input className={styles.rangeSlider} type='range' min={0} max={statePlayer.durationSec} step='1' value={statePlayer.currentSec} onChange={changeTime}/>
          <span>{statePlayer.durationTime}</span>
          <audio loop={false}  muted={!statePlayer.soundEnable} onTimeUpdate={timeUpdater} onEnded={nextSong} src={state.currentTrack?.link}></audio>
        </div>
        <div>
        </div>
      </div>
      <SvgPrevious title='Предыдущий трек' className={styles.audioControlImage} onClick={previousSong}/>
      {
        statePlayer.playing ?
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
        <SvgPlaylist className={styles.audioControlImage} title='Очередь воспроизведения' />
        <span>{state.playlist?.length}</span>
        <SvgClose className={styles.audioControlImage} title='Закрыть' onClick={closePlayer}/>
      </section>
      : null
  }
  </>
}

export default Player
