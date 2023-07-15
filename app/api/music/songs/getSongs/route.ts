import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db.server.ts'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const pagination = Number(searchParams.get('pagination'))
  const page = Number(searchParams.get('page'))
  const filter = searchParams.get('filter') || ''
  const isPlaylist = Boolean(searchParams.get('isPlaylist'))
  const prisma = db

  let condition: Prisma.songFindManyArgs = page && (pagination || isPlaylist) ? {
    skip: (page - 1) * pagination || 0,
    take: pagination || (isPlaylist ? 500 : 0),
    select: {
      id: true,
      name: true,
      year: true,
      trackNum: true,
      duration: true,
      link: true,
      quality: true,
      format: true,
      size: true,
      albumId: true,
      album: true,
      song_artists_artist: {
        select: {
          artist: true
        }
      }
    },
    where: {
      name: {
        contains: filter
      }
    }
  } : {
    take: 500
  }

  let resultWithCount = null
  let result = await prisma.song.findMany(condition)

  if (!isPlaylist){
    resultWithCount = {
      songs: result,
      allSongs: await prisma.song.count({
        where: {
          name: {
            contains: filter
          }
        }
      })
    }
  }

  return NextResponse.json(resultWithCount || result)
}
