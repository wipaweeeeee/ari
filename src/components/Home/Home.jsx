import styles from './styles.module.scss'

const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                Are you at least 21 years of age?
                <div className={styles.buttonsContainer}>
                    <div className={styles.button}>maybe</div>
                    <div className={styles.button}>yes</div>
                </div>
            </div>
            <div className={styles.bg}/>
        </div>
    )
}

export default Home;