import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import MediaLoader from '@/utils/media-loader';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const DriveMedia = ({ fileId, className, activeId, isThumbnail }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const isVisible = useIntersectionObserver(containerRef, {
    rootMargin: '200px', // start fetching slightly before it enters view
    threshold: 0.1,
  });

  useEffect(() => {
    if (!isVisible || !fileId ) return;

    const loadMedia = async () => {
      try {
        setLoading(true);
        const result = await MediaLoader.getMedia(fileId);

        if (result.error) throw new Error(result.error);
        if (!['image', 'video'].includes(result.type)) {
          throw new Error(`Unsupported media type: ${result.type}`);
        }

        setMediaUrl(result.url);
        setMediaType(result.type);
        setError(null);
      } catch (err) {
        console.error('Media load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [isVisible, fileId]);

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current && fileId === activeId) {
      videoRef.current.play();
      videoRef.current.muted = false;
      videoRef.current.loop = true;
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
      videoRef.current.loop = false;
    }
  }, [ mediaType ]);

  return (
    <div ref={containerRef} className={className}>
      {loading && <div className={styles.status}>Loading…</div>}
      {error && <div className={styles.status}>Error: {error}</div>}
      {!loading && !error && mediaType === 'image' && (
        <img
          className={classNames({ [styles.active]: fileId === activeId })}
          src={mediaUrl}
          alt={ `Media ${fileId}`}
          onError={() => setError(`Failed to load image ${fileId}`)}
        />
      )}
      {!loading && !error && mediaType === 'video' && (
        <video
          ref={videoRef}
          src={mediaUrl}
          className={classNames({ [styles.active]: fileId === activeId })}
          controls={!isThumbnail}
          onError={() => setError('Failed to load video')}
        />
      )}
    </div>
  );
};

export default DriveMedia;