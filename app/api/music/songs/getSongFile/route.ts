import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { db } from '@/lib/db.server.ts'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const idTrack = Number(searchParams.get('id'))

  const objTrack = await db.song.findUnique({
    where: {
      id: idTrack
    }
  })

  try {
    if (objTrack?.link?.length) {
      const filePath = path.resolve(process.env.MUSIC_DIRECTORY || '', objTrack?.link)
      const fileBuffer = fs.readFileSync(filePath)

      return new NextResponse( fileBuffer, { headers: { 'content-type': 'audio/mpeg' }})

    } else {
      return NextResponse.json({
        success: false,
        text: 'Ошибка. Не указан путь к файлу'
      })
    }
  }
  catch (e)
  {
    console.log(e)
  }
}
