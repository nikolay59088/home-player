import styles from './index.module.scss'

type FillButtonType = {
  onClick: () => void,
  text: string
}


const FillButton = ({ onClick, text }: FillButtonType) => {
  return (
    <button onClick={onClick} className={styles.fillButtonContainer}>
      {text.toUpperCase()}
    </button>
  )
}

export default FillButton
