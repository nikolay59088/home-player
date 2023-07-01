import { INITIALIZE_STORE, UPDATE_HEADER_NAME, UPDATE_MENU_STATUS, UPDATE_PLAYER_STATUS } from './constants'
import { actionType, contextDataType, currentTrackType } from '@/store/contextTypes.ts'


export const initialState: contextDataType = {
  menuName: 'Главная страница',
  menuOpened: true,
  MPOpened: false,
  currentTrack: {
    name: '',
    artist: '',
    album: '',
    year: 0,
    duration: 0,
    link: '',
    imgSong: '',
    quality: 0
  },
  playlist: []
}
export const appReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
  case INITIALIZE_STORE: {
    return {
      ...action.payload
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

   const imgSong = action.payload.currentTrack?.imgSong.length === 0 && action.payload.currentTrack?.name.length > 0 ? '/images/no-image.png' : action.payload.currentTrack?.imgSong as string

    return {
      ...state,
      MPOpened: action.payload.MPOpened,
      currentTrack: {...state.currentTrack, ...action.payload.currentTrack as currentTrackType, imgSong  }
    }
  }
  default:
    return state
  }
}

export default appReducer
