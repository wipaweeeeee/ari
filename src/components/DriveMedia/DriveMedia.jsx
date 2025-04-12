import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import MediaLoader from '@/utils/media-loader';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const DriveMedia = ({ fileId, className, activeId, isThumbnail, video, play, onLoadError }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const isVisible = useIntersectionObserver(containerRef, {
    rootMargin: '200px',
    threshold: 0.1,
  });

  const handleError = (msg) => {
    console.error(msg);
    setError(msg);
    if (onLoadError) onLoadError(fileId); // Notify parent
  };

  useEffect(() => {
    if (!isVisible || (!fileId && !video)) return;

    const loadMedia = async () => {
      try {
        setLoading(true);

        if (video) {
          setMediaUrl(video);
          setMediaType('video');
          setError(null);
          setLoading(false);
          return;
        }

        const result = await MediaLoader.getMedia(fileId);
        if (result.error) throw new Error(result.error);
        if (!['image', 'video'].includes(result.type)) {
          throw new Error(`Unsupported media type: ${result.type}`);
        }

        setMediaUrl(result.url);
        setMediaType(result.type);
        setError(null);
      } catch (err) {
        handleError(`Failed to load media: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [isVisible, fileId, video]);

  // Control video playback when active
  useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = !play;
  
      if (play) {
        videoRef.current
          .play()
          .catch((err) => console.warn('Autoplay blocked:', err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [mediaType, play]);

  return (
    <div ref={containerRef} className={className}>
      {loading && <div className={styles.status}>Loading…</div>}
      {error && <div className={styles.status}>Error: {error}</div>}

      {!loading && !error && mediaType === 'image' && (
        <img
          className={classNames({ [styles.active]: fileId === activeId })}
          src={mediaUrl}
          alt={`Media ${fileId}`}
          onError={() => handleError(`Failed to load image ${fileId}`)}
        />
      )}

      {!loading && !error && mediaType === 'video' && (
      <video
        ref={videoRef}
        src={mediaUrl}
        className={classNames({ [styles.active]: fileId === activeId })}
        controls={!isThumbnail}
        playsInline={!isThumbnail}
        preload="metadata"
        muted={!play}
        onError={() => handleError(`Failed to load video ${fileId}`)}
      />
      )}
    </div>
  );
};

export default DriveMedia;