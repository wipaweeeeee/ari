import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames'
import styles from './styles.module.scss'

// This component fetches and displays media from Google Drive based on a file ID.
// It handles both images and videos, and provides error handling for unsupported media types.
const DriveMedia = ({ fileId, className, activeId, isThumbnail }) => {
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

    const fetchMedia = async () => {
      try {
        setLoading(true);
        const url = `/.netlify/functions/fetch-media?fileId=${fileId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        // Get content type from headers
        const contentType = response.headers.get('content-type');
        
        // Determine media type based on content type or file extension
        let detectedType = 'unknown';
        if (contentType?.startsWith('image/')) {
          detectedType = 'image';
        } 
        else if (contentType?.startsWith('video/')) {
          detectedType = 'video';
        }
        else if (contentType === 'application/octet-stream' || 
                 fileId.toLowerCase().endsWith('.mov')) {
          detectedType = 'video'; // Assume MOV files are videos
        }

        if (detectedType === 'unknown') {
          throw new Error(`Unsupported media type: ${contentType}`);
        }

        setMediaType(detectedType);
        setMediaUrl(url);
        setError(null);
      } catch (err) {
        console.error('Media load error:', err);
        setError(err.message);
        setMediaUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [fileId]);

  if (loading) return <div>Loading media...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const handlePlayVideo = () => {
    console.log('here');
    if (!isThumbnail) {
      videoRef.current.play();
      videoRef.current.muted = false;
    }
  }

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
      
      {mediaType === 'video' && (
        <video 
          controls={false}
          autoPlay={false}
          muted={true}
          className={classNames({[styles.active] : fileId == activeId})}
          onError={() => setError('Failed to load video')}
          ref={videoRef}
          onClick={handlePlayVideo}
        >
          <source src={mediaUrl} type={mediaUrl?.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
          Your browser does not support this video format.
        </video>
      )}
    </div>
  );
};

export default DriveMedia;