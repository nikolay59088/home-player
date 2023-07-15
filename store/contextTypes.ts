import { UserData } from '@/types/storageTypes.ts'

export type albumType = {
  id: number,
  name: string
}

export type songArtist = {
  songId: number,
  artistId: number,
  artist: {
    id: number,
    name: string
  }
}

export type currentTrackType = {
  id: number,
  name: string,
  year: number,
  trackNum: number,
  duration: number,
  link: string,
  imgSong?: string,
  quality: number,
  format: string,
  size: number,
  albumId: number,
  album: albumType,
  song_artists_artist: songArtist[]
}

export type contextDataType = {
  user?: UserData,
  menuName?: string,
  menuOpened?: boolean,
  MPOpened?: boolean,
  playlist?: currentTrackType[],
  currentTrack?: currentTrackType,
  currentDuration?: string,
  currentTrackId?: number,
  playing?: boolean,
  songsRefreshed?: boolean
}

export type actionType = {
  type: string,
  payload: contextDataType
}
