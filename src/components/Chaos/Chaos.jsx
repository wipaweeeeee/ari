import { useState } from 'react'
import styles from './styles.module.scss'
import { DvdScreensaver } from 'react-dvd-screensaver'

const Chaos = ({show, data}) => {

    const [activeIndex, setActiveIndex] = useState(0);

    const handleUpdate = (count) => {
        console.log(count)
        
    }

    return (
        <div className={styles.chaosContainer}>
            <DvdScreensaver speed={3} impactCallback={handleUpdate}>
                <div className={styles.test}>chaos mode</div>
            </DvdScreensaver>
        </div>
    )
}

export default Chaos;