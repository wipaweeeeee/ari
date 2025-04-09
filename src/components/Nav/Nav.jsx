import styles from './styles.module.scss'
import { motion } from 'framer-motion'
import classNames from 'classnames'

const Nav = ({mode, show, handleMode}) => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={ show ? {opacity: 1} : {opacity: 0}}
            exit={{opacity: 0}}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 1.5 }}
            className={styles.navContainer}
        >
            <div className={classNames(styles.mode, {[styles.active] : mode == 'grid'})} onClick={() => handleMode('grid')}>grid</div>
            <div className={classNames(styles.mode, {[styles.active] : mode == 'chaos'})} onClick={() => handleMode('chaos')}>chaos</div>
            <a href="https://forms.gle/XQYU7Fbuh7oSKMvUA" target="_blank" className={styles.submitButton}>submit a post</a>
        </motion.div>
    )
}

export default Nav;