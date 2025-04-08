import { useState, useEffect } from 'react';

// This component fetches and displays media from Google Drive based on a file ID.
// It handles both images and videos, and provides error handling for unsupported media types.
const DriveMedia = ({ fileId }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileId) {
      setError('No file ID provided');
      setLoading(false);
      return;
    }

    const fetchMedia = async () => {
      try {
        setLoading(true);
        const url = `/.netlify/functions/fetch-image?fileId=${fileId}`;
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

  return (
    <div className="drive-media-container">
      {mediaType === 'image' && (
        <img 
          src={mediaUrl}
          alt="Google Drive content"
          style={{ maxWidth: '100%', height: 'auto' }}
          onError={() => setError('Failed to load image')}
        />
      )}
      
      {mediaType === 'video' && (
        <video 
          controls
          style={{ maxWidth: '100%', height: 'auto' }}
          onError={() => setError('Failed to load video')}
        >
          <source src={mediaUrl} type={mediaUrl?.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
          Your browser does not support this video format.
        </video>
      )}
    </div>
  );
};

export default DriveMedia;