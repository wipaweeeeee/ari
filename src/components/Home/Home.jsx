import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.scss';
import Grid from '@/components/Grid';
import Chaos from '@/components/Chaos';
import Nav from '@/components/Nav';
import useAriData from '@/hooks/useAriData';

const Home = () => {
  const [enter, setEnter] = useState(false);
  const [activeMode, setActiveMode] = useState("grid");
  const [shuffledData, setShuffledData] = useState([]);

  const { data, loading, error } = useAriData();

  // Shuffle once when data is available
  useEffect(() => {
    if (data && data.length && shuffledData.length === 0) {
      setShuffledData(shuffle([...data])); // clone before shuffling
    }
  }, [data]);

  const shuffle = (array) => {
    let i = array.length, j, temp;
    while (--i > 0) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
  };

  const handleMode = (mode) => {
    setActiveMode(mode);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {enter && (
          <Nav mode={activeMode} show={enter} handleMode={handleMode} />
        )}
      </AnimatePresence>

      <motion.div
        className={styles.content}
        animate={enter ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        Are you at least 21 years of age?
        <div className={styles.buttonsContainer}>
          <div className={styles.button} onClick={() => setEnter(true)}>
            maybe
          </div>
          <div className={styles.button} onClick={() => setEnter(true)}>
            yes
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {shuffledData.length && enter && activeMode === "grid" && (
          <Grid show={enter} data={shuffledData} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shuffledData.length && enter && activeMode === "chaos" && (
          <Chaos show={enter} data={shuffledData} />
        )}
      </AnimatePresence>

      <div className={styles.bg} />
    </div>
  );
};

export default Home;