import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db.server.ts'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const idSong = Number(searchParams.get('id'))

  if (idSong !== undefined){
    const resImg = await db.song.findFirst({
      select: {
        imgSong: true
      },
      where: {
        id: idSong
      }
    })

    return NextResponse.json({
      success: true,
      data: resImg?.imgSong || ''
    })
  }else{
    return NextResponse.json({
      success: false,
      text: 'Не указан id песни'
    })
  }
}
