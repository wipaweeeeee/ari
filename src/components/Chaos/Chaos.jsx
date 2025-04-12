import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { DvdScreensaver } from 'react-dvd-screensaver';
import DriveMedia from '@/components/DriveMedia';
import { motion } from 'framer-motion';

const Chaos = ({ show, data }) => {
  const [activeId, setActiveId] = useState();
  const [mobile, setMobile] = useState(false);
  const [erroredIds, setErroredIds] = useState([]);

  const handleUpdate = (count) => {
    const validItems = data.filter((item) => item.gid && !erroredIds.includes(item.gid));

    if (validItems.length === 0) return;

    const nextItem = validItems[count % validItems.length];
    setActiveId(nextItem.gid);
  };

  const handleMediaError = (id) => {
    setErroredIds((prev) => [...prev, id]);
  };

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut', delay: 0.5 }}
      className={styles.chaosContainer}
    >
      <div className={styles.greeting}>Happy 40th Birthday Ari!</div>
      <div className={styles.xoxo}>xoxo all your friends</div>

      <DvdScreensaver speed={mobile ? 1 : 3} impactCallback={handleUpdate}>
        <div className={styles.chaosImageContainer}>
          {activeId && !erroredIds.includes(activeId) && (
            <DriveMedia
              fileId={activeId}
              activeId={null}
              className={styles.chaosImage}
              play={true}
              isThumbnail={true}
              onLoadError={handleMediaError}
            />
          )}
        </div>
      </DvdScreensaver>
    </motion.div>
  );
};

export default Chaos;