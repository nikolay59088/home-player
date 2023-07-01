import AlbumItem from "@/components/albumItem";
import styles from './page.module.scss'

const Page = () => {
  return (
    <main className={styles.albumPageContainer}>
      <div className={styles.albumSongsContainer}>
        <AlbumItem name={'test'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test2'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test3'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test2'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test3'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test2'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test3'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test2'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test3'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test2'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test3'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test2'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test3'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
        <AlbumItem name={'test4'} album={'album'} albumLogo={'/images/album.svg'} link={''}/>
      </div>

    </main>
  )
}

export default Page
