import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db.server.ts'
import { Prisma } from '@prisma/client'
import { getErrorResponse } from '@/lib/helpers.ts'


export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)

  const pagination = Number(searchParams.get('pagination'))
  const page = Number(searchParams.get('page'))
  const filter = searchParams.get('filter') || ''
  const prisma = db

  let condition: Prisma.albumFindManyArgs | undefined = page && pagination ? {
    skip: (page - 1) * pagination || 0,
    take: pagination || 15,
    select: {
      name: true,
      id: true,
      album_artists_artist: {
        select: {
          artist: {
            select: {
              name: true
            }
          }
        }
      },
      song: {
        select: {
          imgSong: true
        },
        where: {
          imgSong: {
            not: ''
          }
        },
        take: 1
      }
    },
    where: {
      name: {
        contains: filter
      }
    }
  } : undefined

  if (condition === undefined){

    return getErrorResponse(500, 'Не все параметры получены')

  }else{

    const albums = await prisma.album.findMany(condition)
    const allAlbums = await prisma.album.count({
      where: {
        name: {
          contains: filter
        }
      }
    })

    return NextResponse.json({
      albums,
      allAlbums
    })

  }
}
