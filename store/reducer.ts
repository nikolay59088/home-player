import {
  INITIALIZE_STORE,
  UPDATE_HEADER_NAME,
  UPDATE_MENU_STATUS,
  UPDATE_PLAYER_STATUS,
  UPDATE_REFRESH_STATUS, UPDATE_USER_DATA
} from './constants'
import { actionType, contextDataType } from '@/store/contextTypes.ts'
import { getUserTemplate } from '@/lib/localStorage.ts'


export const initialState: contextDataType = {
  user: getUserTemplate(),
  menuName: 'Главная страница',
  menuOpened: true,
  MPOpened: false,
  currentTrackId: -1,
  currentTrack: {
    id: -1,
    album: {
      name: '',
      id: -1
    },
    name: '',
    quality: 0,
    duration: 0,
    format: '',
    year: 0,
    trackNum: 0,
    link: '',
    albumId: 0,
    size: 0,
    imgSong: '/images/no-image.png',
    song_artists_artist: []
  },
  songsRefreshed: false,
  currentDuration: '--:--',
  playing: false,
  playlist: []
}
export const appReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
  case INITIALIZE_STORE: {
    return {
      ...action.payload
    }
  }
  case UPDATE_USER_DATA: {
    return {
      ...state,
      user: action.payload.user
    }
  }
  case UPDATE_HEADER_NAME: {
    return {
      ...state,
      menuName: action.payload.menuName
    }
  }
  case UPDATE_MENU_STATUS: {
    return {
      ...state,
      menuOpened: action.payload.menuOpened
    }
  }
  case UPDATE_PLAYER_STATUS: {
    return {
      ...state,
      MPOpened: action.payload.MPOpened !== undefined ? action.payload.MPOpened : state.MPOpened,
      playlist: action.payload.playlist !== undefined ? action.payload.playlist : state.playlist,
      currentTrackId: action.payload.currentTrackId !== undefined ? action.payload.currentTrackId : state.currentTrackId,
      currentTrack: action.payload.currentTrack !== undefined ? action.payload.currentTrack : state.currentTrack,
      currentDuration: action.payload.currentDuration !== undefined ? action.payload.currentDuration : state.currentDuration,
      playing: action.payload.playing !== undefined ? action.payload.playing : state.playing
    }
  }
  case UPDATE_REFRESH_STATUS: {
    return {
      ...state,
      songsRefreshed: action.payload.songsRefreshed
    }
  }
  default:
    return state
  }
}

export default appReducer
