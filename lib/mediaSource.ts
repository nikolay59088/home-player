

export const mimeCodec = 'audio/mpeg'

const tempProcessStreaming = (mediaSource: MediaSource, sourceBuffer: SourceBuffer, playing: boolean, audio: HTMLAudioElement, reader: ReadableStreamDefaultReader) => (data: any) => {
  console.log(data?.value)
  console.log(data?.done)
  if (data?.done){
    let closed = false

    while(!closed){
      let closedIter = true
      for (let arrBuff of mediaSource.sourceBuffers){
        if (!arrBuff.updating){
          closed = false
          break
        }
      }
      console.log('ждем')
      closed = closedIter
    }
    mediaSource.endOfStream()
    console.log('exit')
  }
  console.log('add')


  // @ts-ignore
  try {
    sourceBuffer.appendBuffer(data?.value)
  }catch (e){
    console.log('Создаем новый')
    try {
      sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
      sourceBuffer.mode = 'sequence'
      sourceBuffer.onupdateend = () => reader?.read().then(tempProcessStreaming(mediaSource, sourceBuffer, playing, audio, reader))

      sourceBuffer.appendBuffer(data?.value)
    }catch (e){
      console.log(e)
    }

  }


  console.log(mediaSource)

  if (playing){
    audio.play()
  }
  console.log('updated')
}

export const sourceOpen = (mediaSource: MediaSource, TrackId: number, playing:boolean, audio: HTMLAudioElement) => {
  console.log('iterable run')
  for (let bufferItem of mediaSource.sourceBuffers) {
    console.log(bufferItem)
  }
  console.log('iterable end')
  console.log('------------------------')

  // let sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
  // sourceBuffer.mode = 'sequence'

  fetch(window.origin + `/api/music/songs/getSongFile?id=${TrackId}`)
    .then(res => {
      return res.body?.getReader()
    })
    // .then(reader => {
    //
    //   sourceBuffer.addEventListener('updateend', () => {
    //     console.log('updated')
    //     reader?.read().then(processStream(sourceBuffer, mediaSource))
    //     if (playing){
    //       audio.play()
    //     }
    //   })
    //
    //   reader?.read().then(processStream(sourceBuffer, mediaSource))
    //
    // })
    .then((reader) => {


      let sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
      sourceBuffer.mode = 'sequence'
      sourceBuffer.onupdateend = () => reader?.read().then(tempProcessStreaming(mediaSource, sourceBuffer, playing, audio, reader))

      reader?.read().then(tempProcessStreaming(mediaSource, sourceBuffer, playing, audio, reader))

    })

    // .then(res => {
    //   const reader = res.body?.getReader()
    //
    //   return new ReadableStream({
    //     start(controller){
    //       const pump = (): any => {
    //         return reader?.read().then(({ done, value }) => {
    //           if (done){
    //             controller.close()
    //             return
    //           }
    //
    //           let tempBuffer = new Uint8Array([...value])
    //
    //           while (tempBuffer.byteLength > chunkSize){
    //             const chunkToSend = tempBuffer.slice(0, chunkSize)
    //             controller.enqueue(chunkToSend)
    //             tempBuffer = new Uint8Array([...tempBuffer.slice(chunkSize)])
    //           }
    //           if (tempBuffer.byteLength){
    //             controller.enqueue(tempBuffer)
    //           }
    //
    //           return pump()
    //         })
    //       }
    //       return pump()
    //     }
    //   })
    // })
    // .then(res => res.getReader())
    // .then(reader => {
    //   sourceBuffer.addEventListener('updateend', () => {
    //         console.log('updated')
    //         reader?.read().then(processStream(sourceBuffer, mediaSource))
    //         if (playing){
    //           audio.play()
    //         }
    //       })
    //
    //       reader?.read().then(processStream(sourceBuffer, mediaSource))
    // })
}

export const playAudio = (audio: HTMLAudioElement, TrackId: number, playing: boolean) => {

  if (MediaSource.isTypeSupported(mimeCodec)){
    let mediaSource = new MediaSource
    audio.src = URL.createObjectURL(mediaSource)

    mediaSource.addEventListener('sourceopen',  () => sourceOpen(mediaSource, TrackId, playing, audio))

    mediaSource.addEventListener('sourceended', () => {
      console.log('ended')
      if (playing){
        audio.play()
      }
    })
  }else{
    alert(`Can not play the media. Media of MIME type ${mimeCodec} is not supported.`)
  }

  // Audio Context
  // const context = new AudioContext
  //
  // audio.crossOrigin = 'anonymous'
  // let currentTime = 0
  //
  // fetch(window.origin + `/api/music/getSongFile?id=${TrackId}`)
  //   .then(res => {
  //     return res.body?.getReader()
  //   })
  //   .then(reader => {
  //
  //     let pump = () => {
  //       reader?.read().then(({value, done}) => {
  //         if (value !== undefined){
  //           context.decodeAudioData(value.buffer).then(buffer => {
  //             const source = context.createBufferSource()
  //             source.connect(context.destination)
  //             source.buffer = buffer
  //             source.start(currentTime)
  //             currentTime += buffer.duration - .1
  //             console.log(currentTime)
  //
  //             if(!done) pump()
  //           })
  //         }
  //
  //       })
  //     }
  //
  //     pump()
  //   })
}

