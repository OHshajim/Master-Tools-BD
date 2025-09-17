
/**
 * Utility functions for generating thumbnails from videos
 */

/**
 * Generates a thumbnail from a video URL
 * @param videoURL The URL of the video to generate a thumbnail from
 * @returns A promise that resolves to the thumbnail URL as a data URL
 */
export const generateThumbnailFromVideo = (videoURL: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoURL;
    
    // Try to load the metadata first
    video.addEventListener('loadedmetadata', () => {
      // If possible, get thumbnail from 25% of the way through the video
      video.currentTime = video.duration * 0.25;
    });
    
    // Once we can actually draw the frame
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get the data URL and resolve
      try {
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailUrl);
      } catch (err) {
        reject(err);
      }
    });
    
    // Handle errors
    video.addEventListener('error', (e) => {
      reject(new Error('Video error: ' + e));
    });
    
    // If there's no thumbnail after 5 seconds, try a default frame
    const timeout = setTimeout(() => {
      if (video.readyState >= 1) {
        video.currentTime = 0;
      }
    }, 5000);
    
    // Clean up the timeout
    video.addEventListener('seeked', () => {
      clearTimeout(timeout);
    }, { once: true });
    
    // Start loading the video
    video.load();
  });
};
