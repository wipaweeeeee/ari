import { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { DvdScreensaver } from 'react-dvd-screensaver'
import DriveMedia from '@/components/DriveMedia'
import { motion } from 'framer-motion'

const Chaos = ({show, data}) => {

    const [activeId, setActiveId] = useState();
    const [mobile, setMobile] = useState(false);

    const handleUpdate = (count) => {

        if (count % data.length < data.length) {
            let currId = data[count % data.length].gid;
            if (currId != null) {
                setActiveId(currId);
            }
        } else {
            let currId = data[0].gid;
            setActiveId(currId);
        }
    }

     //handles responsive
     useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMobile(true);
            } else {
                setMobile(false);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[])

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={ show ? {opacity: 1} : {opacity: 0}}
            exit={{opacity: 0}}
            transition={{ duration: 0.25, ease: 'easeInOut', delay: 0.5 }}
            className={styles.chaosContainer}
        >
            <div className={styles.greeting}>Happy 40th Birthday Ari!</div>
             <div className={styles.xoxo}>xoxo all your friends</div>
            <DvdScreensaver speed={mobile ? 1 : 3} impactCallback={handleUpdate}>
                <div className={styles.chaosImageContainer}>
                     <DriveMedia fileId={activeId} activeId={null} className={styles.chaosImage} play={true} isThumbnail={true}/>
                </div>
            </DvdScreensaver>
        </motion.div>
    )
}

export default Chaos;