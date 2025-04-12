import { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { motion } from 'framer-motion'
import classNames from 'classnames'
import DriveMedia from '@/components/DriveMedia';

const Grid = ({show, data}) => {
    
    const [activeId, setActiveId] = useState();
    const [activeContent, setActiveContent] = useState("");
    const [activeName, setActiveName] = useState("");
    const [mobile, setMobile] = useState(false);
    const [playVideo, setPlayVideo] = useState(false); 

    const handleSelect = (id) => {
        setActiveId(id);

        let message = data.filter(item => item.gid == id)[0].message;
        let name = data.filter(item => item.gid == id)[0].name;
        setActiveContent(message);
        setActiveName(name);
        // setPlayVideo(!playVideo);
    }

    let images = data && data.map((item, index) => {
        const { gid, isVideo } = item;
        if ( gid != null ) {
            return (
                <div key={index} onClick={() => handleSelect(gid)}>
                    <DriveMedia isVideo={isVideo} fileId={gid} activeId={activeId} className={styles.imageItem} play={false} isThumbnail={true}/>
                </div>
            )
        }
    });

    //handles responsive
    useEffect(() => {

        //set first load item
        let timer = setTimeout(() => {
            let firstId = data && data[0].gid;
            handleSelect(firstId);
        }, 2500)
        

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
            clearTimeout(timer);
        };
    },[])

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={ show ? {opacity: 1} : {opacity: 0}}
            exit={{opacity: 0}}
            transition={{ duration: 0.25, ease: 'easeInOut', delay: 0.5 }}
            className={styles.gridContainer}
        >
            {
                !mobile && 
                <motion.div
                    className={styles.greeting}
                    initial={{ fontSize: '120px', lineHeight: '120px' }}
                    animate={{ fontSize: '20px', lineHeight: '20px', top: '40px', left: '32px', textAlign: 'left' }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
                >
                    Happy 40th Birthday Ari!
                </motion.div>
            }
            {
                mobile &&
                <motion.div
                    className={styles.greeting}
                    initial={{ fontSize: '60px', lineHeight: '60px' }}
                    animate={{ fontSize: '20px', lineHeight: '20px', top: '62dvh', left: '0', textAlign: 'center' }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
                >
                    Happy 40th Birthday Ari!
            </motion.div>

            }
            <motion.div
                className={styles.xoxo}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
            >
                xoxo all your friends
            </motion.div>
            <motion.div
                className={styles.imageContainer}
                animate={  activeId == null ? { opacity: 0} : {opacity: 1}}
            >
                 <DriveMedia fileId={activeId} activeId={null} className={styles.fullscreenImage} play={playVideo} isThumbnail={false}/>
            </motion.div>
            <motion.div
                animate={  activeContent == "" ? { opacity: 0} : {opacity: 1}}
                className={styles.messageContainer}
            >
                <div>{activeContent}</div>
                <div className={styles.name}>{activeName}</div>
            </motion.div>
            <motion.div
                className={styles.imageCarousel}
                initial={{ x: '100%', opacity: 0}}
                animate={{ x: '0%', opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
            >
                {images}
            </motion.div>
        </motion.div>
    )
}

export default Grid;