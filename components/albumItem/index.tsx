import styles from './index.module.scss'
import Link from "next/link";

type AlbumItemType = {
    name: string,
    album: string,
    albumLogo: any,
    link: string
}

const AlbumItem = ({ name, album, albumLogo, link }: AlbumItemType) => {
    return (
        <Link href={link} className={styles.albumItemContainer}>
        <img src={albumLogo} alt={name}/>
            <span className={styles.nameSong}>{name}</span>
            <span>{album}</span>
        </Link>
    );
};

export default AlbumItem;
