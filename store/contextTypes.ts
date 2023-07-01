
export type currentTrackType = {
  name: string,
  artist: string,
  album: string
  year: number,
  duration: number,
  quality: number,
  link: string,
  imgSong: string
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
