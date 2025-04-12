import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames'
import styles from './styles.module.scss'
import MediaLoader from '@/utils/media-loader';

// This component fetches and displays media from Google Drive based on a file ID.
// It handles both images and videos, and provides error handling for unsupported media types.
const DriveMedia = ({ fileId, className, activeId, play, isThumbnail, isVideo }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef();

  useEffect(() => {
    if (!fileId) {
      setError('No file ID provided');
      setLoading(false);
      return;
    }

    const loadMedia = async () => {
      try {
        setLoading(true);
        const result = await MediaLoader.getMedia(fileId);

        console.log('Media result:', result);
        
        if (result.error) {
          throw new Error(result.error);
        }

        if (!['image', 'video'].includes(result.type)) {
          throw new Error(`Unsupported media type: ${ result.type }`);
        }

        setMediaUrl(result.url);
        setMediaType(result.type);
        setError(null);
      } catch (err) {
        console.error('Media load error:', err);
        setError(err.message);
        setMediaUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [fileId]);

  useEffect(()=> {
    if (mediaType == 'video') {
      if (videoRef.current != null) {
        videoRef.current.play();
        videoRef.current.muted = false;
        videoRef.current.loop = true;
      }
    } else {
      if (videoRef.current != null) { 
        videoRef.current.pause();
        videoRef.current.muted = true;
        videoRef.current.loop = false;
      }
    }
  }, [mediaType]);

  if (loading) return <div className={classNames(className, styles.status)}>Loading..</div>;
  if (error) return <div className={classNames(className, styles.status)}>Error: {error}</div>;

  return (
    <div className={className}>
      {mediaType === 'image' && (
        <img 
          className={classNames({[styles.active] : fileId == activeId})}
          src={mediaUrl}
          alt="Google Drive content"
          onError={() => setError('Failed to load image')}
        />
      )}
    </div>
  );
};

export default DriveMedia;