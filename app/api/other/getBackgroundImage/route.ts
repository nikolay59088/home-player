import { NextResponse } from 'next/server'


export async function GET() {

  const headers = {
    Authorization: 'Client-ID Cz9mv5kJEA1bCB4LwpDALcuXHWDGanawnkjzQ36PZVA',
  }

  const images = await fetch('https://api.unsplash.com/collections/1065384/photos/', { headers })
  const imagesJSON = await images.json()

  let result = ''

  while(true){
    const item = imagesJSON[Math.floor(Math.random()*imagesJSON.length)];
    if (item.width > item.height){
      result = item.urls.full
      break
    }
  }

  console.log(result)

  return NextResponse.json({
    image: result
  })
}
