import { useState } from 'react'
import styles from './styles.module.scss'
import { motion } from 'framer-motion'
import classNames from 'classnames'

const Grid = ({show, data}) => {

    const [activeIndex, setActiveIndex] = useState(1);
    const [activeImage, setActiveImage] = useState("");
    const [activeContent, setActiveContent] = useState("");

    const handleSelect = (index) => {
        setActiveIndex(index);
        setActiveImage(data[index].image);
        setActiveContent(data[index].content);
    }

    let images = data && data.map((item, index) => {
        return (
            <div key={index} className={styles.imageItem} onClick={() => handleSelect(index)}>
                <img className={classNames({[styles.active] : activeIndex == index})} src={`/${item.image}.jpg`} />
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
                initial={{ fontSize: '120px', lineHeight: '120px' }}
                animate={{ fontSize: '20px', lineHeight: '20px', top: '40px', left: '32px', textAlign: 'left' }}
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
                className={styles.imageContainer}
                animate={  activeImage == "" ? { opacity: 0} : {opacity: 1}}
            >
                <img className={styles.fullscreenImage} src={`/${activeImage}.jpg`} />
            </motion.div>
            <motion.div
                animate={  activeContent == "" ? { opacity: 0} : {opacity: 1}}
                className={styles.messageContainer}
            >
                <div>{activeContent}</div>
            </motion.div>
            <motion.div
                className={styles.imageCarousel}
                initial={{ x: '100%'}}
                animate={{ x: '0%' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
            >
                {images}
            </motion.div>
        </motion.div>
    )
}

export default Grid;