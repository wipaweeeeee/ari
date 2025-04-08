import styles from './styles.module.scss'
import { motion } from 'framer-motion'

const Grid = ({active, show, imageAssets}) => {

    let images = imageAssets && imageAssets.map((item, index) => {
        return (
            <div key={index} className={styles.imageItem}>
                <img src={`/${item}.jpg`} />
            </div>
        )
    })

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={ show ? {opacity: 1} : {opacity: 0}}
            exit={{opacity: 0}}
            transition={{ duration: 0.25, ease: 'easeInOut', delay: 0.5 }}
            className={styles.gridContainer}
        >
            <motion.div
                className={styles.greeting}
                initial={{ fontSize: '140px' }}
                animate={{ fontSize: '20px', top: '25px', left: '32px', textAlign: 'left' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
            >
                Happy 40th Birthday Ari!
            </motion.div>
            <motion.div
                className={styles.xoxo}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
            >
                xoxo all your friends
            </motion.div>
            <motion.div
                className={styles.imageCarousel}
            >
                {images}
            </motion.div>
        </motion.div>
    )
}

export default Grid;