import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './styles.module.scss'
import Grid from '@/components/Grid'
import Nav from '@/components/Nav'
import useAriData from '@/hooks/useAriData';

var dataSet = [
    {name: "Nicholas", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_1"},
    {name: "Jane", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_2"},
    {name: "Nao", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_3"},
    {name: "Jeff", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_4"},
    {name: "Wip", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_5"},
    {name: "Joe", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_6"},
    {name: "Kate", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_7"},
    {name: "Maggio", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_8"},
    {name: "Wong", content: "I WILL NEVER FORGET...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ", image: "ari_9"},
]

const Home = () => {

    const [ enter, setEnter ] = useState(false);
    const [ activeMode, setActiveMode ] = useState("grid");

    var imageAssets = ["ari_1", "ari_2", "ari_3", "ari_4", "ari_5", "ari_6", "ari_7", "ari_8", "ari_9"]

    // useAriData returns an object with data, loading, and error properties
    // data is an array of objects with the Google Sheets form responses, each containing timestamp, name, message, and gid properties 
    // loading is a boolean indicating if the data is still being fetched
    // error is a string containing any error message that occurred during the fetch
    const { data, loading, error } = useAriData();
    
    function shuffle(array){
        let i = array.length, j, temp;
        while (--i > 0) {
        j = Math.floor(Math.random () * (i+1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
        }

        return array
    }

    const handleMode = (mode) => {
        setActiveMode(mode)
    }

    return (
        <div className={styles.container}>
            <AnimatePresence>
                { enter && <Nav mode={activeMode} show={enter} handleMode={(mode) => handleMode(mode)}/>}
            </AnimatePresence>
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
            { enter &&  <Grid show={enter} imageAssets={imageAssets} data={shuffle(data)}/>}
            </AnimatePresence>
           
            <div className={styles.bg}/>
        </div>
    )
}

export default Home;