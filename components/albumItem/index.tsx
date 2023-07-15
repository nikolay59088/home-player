import styles from './index.module.scss'
import Link from "next/link";

type AlbumItemType = {
    name: string,
    artists: {
        artist: {
          name: string
        }
    }[],
    albumLogo: any,
    idAlbum: number
}

const AlbumItem = ({ name, artists, albumLogo, idAlbum }: AlbumItemType) => {

  const artistsArr = artists.map(artist => artist.artist.name)

    return (
        <Link href={window.origin + '/api/music/albums/getAlbums/' + idAlbum} className={styles.albumItemContainer}>
            <img src={albumLogo} alt={name}/>
          <div className={styles.albumNameContainer}>
            <span className={styles.nameSong}>{name}</span>
            <span className={styles.artistsSong}>{artistsArr.join(', ')}</span>
          </div>

        </Link>
    );
};

export default AlbumItem;
