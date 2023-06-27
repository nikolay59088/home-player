
type currentTrackType = {
  name: string,
  artist: string,
  album: string
  year: number,
  duration: string,
  link: string
}

export type contextDataType = {
  menuName?: string,
  menuOpened?: boolean,
  MPOpened?: boolean,
  currentTrack?: currentTrackType,
  playlist?: currentTrackType[]
}

export type actionType = {
  type: string,
  payload: contextDataType
}