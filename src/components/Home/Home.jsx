import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './styles.module.scss'
import Grid from '@/components/Grid'

const Home = () => {

    const [ enter, setEnter ] = useState(false);
    const [ activeMode, setActiveMode ] = useState("grid");

    var imageAssets = ["ari_1", "ari_2", "ari_3", "ari_4", "ari_5", "ari_6", "ari_7", "ari_8", "ari_9"]

    return (
        <div className={styles.container}>
            <motion.div 
                className={styles.content}
                animate={enter ? { opacity: 0 } : { opacity : 1}}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                Are you at least 21 years of age?
                <div className={styles.buttonsContainer}>
                    <div className={styles.button}>maybe</div>
                    <div className={styles.button} onClick={() => setEnter(true)}>yes</div>
                </div>
            </motion.div>

            <AnimatePresence>
            { enter &&  <Grid active={activeMode == "grid"} show={enter} imageAssets={imageAssets}/>}
            </AnimatePresence>
            
           
            <div className={styles.bg}/>
        </div>
    )
}

export default Home;