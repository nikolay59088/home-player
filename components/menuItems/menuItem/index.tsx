import Link from 'next/link'
import styles from './index.module.scss'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type MenuItemType = {
  address: string,
  text: string,
  icon: string,
  opened: boolean
}

const MenuItem = ({ address, text, icon, opened = true }: MenuItemType) => {

  const pathname = usePathname()

  return (
    <Link
      href={address}
      className={styles.menuItemContainer + ' ' + (!opened ? styles.menuItemContainerClosed : '') + ' ' + (pathname === address ? styles.activeItem : null)}
    >
      <Image
        className={styles.imageItem}
        src={`/images/${icon}.svg`}
        alt={text}
        width={25}
        height={25}
      />
      {
        opened ? <span>{text}</span> : null
      }

    </Link>
  )
}

export default MenuItem