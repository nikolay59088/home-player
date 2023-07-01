import styles from './index.module.scss'

type TagType = {
    text: string
}

const Tag = ({ text }: TagType) => {
    return (
        <div className={styles.tagContainer}>
            {text}
        </div>
    );
};

export default Tag;
