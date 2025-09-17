
/**
 * Utility functions for YouTube URL handling
 */

/**
 * Extracts YouTube video ID from various YouTube URL formats including Shorts
 * @param url YouTube URL
 * @returns Video ID or null if invalid
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,  // YouTube Shorts support
    /youtu\.be\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Validates if a URL is a valid YouTube URL including Shorts
 * @param url URL to validate
 * @returns boolean
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  // More comprehensive validation
  const youtubeRegex = /^https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\/.+/;
  
  // First check if it's a YouTube domain
  if (!youtubeRegex.test(url)) {
    return false;
  }
  
  // Then check if we can extract a video ID
  return extractYouTubeVideoId(url) !== null;
};

/**
 * Generates YouTube thumbnail URL from video ID
 * @param videoId YouTube video ID
 * @param quality Thumbnail quality ('default', 'hqdefault', 'maxresdefault')
 * @returns Thumbnail URL
 */
export const generateYouTubeThumbnail = (videoId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault'): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Generates YouTube embed URL from video ID
 * @param videoId YouTube video ID
 * @returns Embed URL
 */
export const generateYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Gets YouTube video title from URL (requires API key in real implementation)
 * For now, returns a placeholder
 * @param url YouTube URL
 * @returns Promise<string>
 */
export const getYouTubeVideoTitle = async (url: string): Promise<string> => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return 'YouTube Video';
  
  // In a real implementation, you would use YouTube Data API v3
  // For now, return a placeholder
  return `YouTube Video - ${videoId}`;
};
