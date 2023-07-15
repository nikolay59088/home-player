import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parseFile } from 'music-metadata'
import { db } from '@/lib/db.server.ts'
import { PrismaClient } from '@prisma/client'

type objSong = {
  bitrate: number,
  duration: number,
  name: string,
  trackNum: number,
  artists: string[],
  albumName: string,
  albumArtists: string[],
  year: number,
  genre: string[],
  imgSong: string,
  format: string,
  link: string,
  size: number
}

export async function GET(){

  try{
    fs.accessSync((process.env.MUSIC_DIRECTORY || ''), fs.constants.R_OK)
    let arrSongs: objSong[] = []
    await createArrSongs(arrSongs, (process.env.MUSIC_DIRECTORY || ''))
    await refreshTableInfo(arrSongs)

    return NextResponse.json({
      success: true,
      text: 'Библиотека обновлена'
    })
  }catch (err) {
    console.log(err)
    return NextResponse.json({
      success: false,
      text: 'Обновление библиотеки завершилось с ошибкой'
    })
  }
}

const createArrSongs = async (arrSongs: objSong[], currDirectory: string) => {
  const arrFiles =  fs.readdirSync(currDirectory)


  for (const index in arrFiles){
    const filePath = path.join(currDirectory, arrFiles[index])
    const infoFile = fs.lstatSync(filePath)

    if(infoFile.isDirectory()){
      await createArrSongs(arrSongs, filePath)
    }else {
      const fileFormat = path.extname(filePath)
      if (fileFormat === '.mp3') {
        let metadata = await parseFile(filePath)
        const picture = metadata.common.picture
        let song: objSong = {
          albumArtists: [metadata.common.albumartist || ''],
          albumName: metadata.common.album || '',
          artists: metadata.common.artists || [],
          bitrate: (metadata.format.bitrate || 0) / 1000,
          duration: Math.floor(metadata.format.duration || 0),
          genre: metadata.common.genre || [],
          imgSong: picture === undefined ? '' : `data:${picture[0].format};base64,${picture[0].data.toString('base64')}`,
          name: metadata.common.title || '',
          trackNum: metadata.common.track.no || 0,
          year: metadata.common.year || 0,
          format: fileFormat.replace('.', ''),
          link: filePath.replace(process.env.MUSIC_DIRECTORY + '\\', ''),
          size: infoFile.size
        }
        arrSongs.push(song)
      }
    }
  }
}

const refreshTableInfo = async (arrSongs: objSong[]) => {

  const prisma = db

  await prisma.song.updateMany({
    data: {
      refreshed: false
    }
  })


  for(let indexElem in arrSongs){
    const currSong = arrSongs[indexElem]

    //Создание исполнителей если отсутствуют
    let arrArtistsId: number[] = []
    for(let indexArtist in currSong.artists){
      if (currSong.artists[indexArtist] !== ''){
        await createArtist(prisma, currSong.artists[indexArtist], arrArtistsId)
      }
    }


    //Создание исполнителей альбома
    let arrAlbumArtistsId: number[] = []
    if (currSong.albumArtists.length){
      for (let indexElem in currSong.albumArtists){
        if (currSong.albumArtists[indexElem] !== ''){
          await createArtist(prisma, currSong.albumArtists[indexElem], arrAlbumArtistsId)
        }
      }
    }

    //Если исполнители отсутствуют
    if (arrArtistsId.length === 0 && arrAlbumArtistsId.length === 0){
      await createArtist(prisma, '', arrArtistsId)
    }

    // Создание альбома
    let albumId = 0
    if (currSong.albumName.length){
      const foundAlbum = await prisma.album.findMany({
        where: {
          name: currSong.albumName
        }
      })

      if(foundAlbum.length){
        albumId = foundAlbum[0].id
      }else{
        const newAlbum = await prisma.album.create({
          data: {
            name: currSong.albumName
          }
        })
        albumId = newAlbum.id
      }
    }

    //Связывание исполнителей альбома с альбомом
    if (albumId && arrAlbumArtistsId.length){
      for (let indexAlbumArtist in arrAlbumArtistsId){
        const foundRel = await prisma.album_artists_artist.findMany({
          where: {
            albumId,
            artistId: arrAlbumArtistsId[indexAlbumArtist]
          }
        })

        if (foundRel.length === 0){
          await prisma.album_artists_artist.create({
            data: {
              artistId: arrAlbumArtistsId[indexAlbumArtist],
              albumId
            }
          })
        }
      }
    }

    //Создание песни
    const foundSong = await prisma.song.findMany({
      where: {
        name: currSong.name,
        albumId,
        trackNum: currSong.trackNum,
        year: currSong.year,
        duration: currSong.duration,
        quality: currSong.bitrate,
        format: currSong.format
      }
    })

    if (foundSong.length){
      await prisma.song.update({
        data: {
          refreshed: true
        },
        where: {
          id: foundSong[0].id
        }
      })
    }
    else
    {
      const newSong = await prisma.song.create({
        data: {
          name: currSong.name,
          albumId,
          trackNum: currSong.trackNum,
          year: currSong.year,
          duration: currSong.duration,
          quality: currSong.bitrate,
          format: currSong.format,
          imgSong: currSong.imgSong,
          size: currSong.size,
          link: currSong.link,
          refreshed: true
        }
      })

      //Создание жанра
      let arrGenres: number[] = []
      for (let indexGenre in currSong.genre){
        const foundGenre = await prisma.genre.findMany({
          where: {
            name: currSong.genre[indexGenre]
          }
        })

        if (foundGenre.length){
          arrGenres.push(foundGenre[0].id)
        }else{
          const newGenre = await prisma.genre.create({
            data: {
              name: currSong.genre[indexGenre]
            }
          })
          arrGenres.push(newGenre.id)
        }
      }

      //Привязывание жанра к песне
      for (let indexGenre in arrGenres){
        await prisma.song_genres_genre.create({
          data: {
            songId: newSong.id,
            genreId: arrGenres[indexGenre]
          }
        })
      }

      for (let indexArtist in arrArtistsId){
        await prisma.song_artists_artist.create({
          data: {
            songId: newSong.id,
            artistId: arrArtistsId[indexArtist]
          }
        })
      }
    }
  }

  await clearDatabase(prisma)

  await prisma.$disconnect()
}

const createArtist = async (prisma: PrismaClient, artist: string, arrArtistsId: number[]) => {
  const foundArtists = await prisma.artist.findMany({
    where: {
      name: artist
    }
  })
  let artistId: any
  if (foundArtists.length === 0){
    const newArtist = await prisma.artist.create({
      data: {
        name: artist
      }
    })
    artistId = newArtist.id
  }else{
    artistId = foundArtists[0].id
  }
  arrArtistsId.push(artistId)
}

const clearDatabase = async (prisma: PrismaClient) => {

  await prisma.song.deleteMany({
    where: {
      refreshed: false
    }
  })
}


