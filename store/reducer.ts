import { INITIALIZE_STORE, UPDATE_HEADER_NAME, UPDATE_MENU_STATUS, UPDATE_PLAYER_STATUS } from './constants'
import { actionType, contextDataType } from '@/store/contextTypes.ts'

export const initialState: contextDataType = {
  menuName: 'Главная страница',
  menuOpened: true,
  MPOpened: false,
  currentTrack: {
    name: ''
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
    return {
      ...state,
      MPOpened: action.payload.MPOpened
    }
  }
  default:
    return state
  }
}

export default appReducer