
// Helper function to get domain from platform name
export const getPlatformDomain = (platform: string): string => {
  // Safely handle undefined platform
  if (!platform) return 'example.com';
  
  // Clean up platform name for domain
  const cleanPlatform = platform.toLowerCase().trim();
  
  // Define specific mappings for common platforms
  const domainMap: Record<string, string> = {
    'udemy': 'udemy.com',
    'coursera': 'coursera.org',
    'skillshare': 'skillshare.com',
    'masterclass': 'masterclass.com',
    'canva': 'canva.com',
    'canva pro': 'canva.com',
    'grammarly': 'grammarly.com',
    'chatgpt': 'chat.openai.com',
    'quillbot': 'quillbot.com',
    'code academy': 'codecademy.com',
    'codecademy': 'codecademy.com',
    'udemy business': 'business.udemy.com',
    'coursera plus': 'coursera.org'
  };
  
  // Return mapped domain or generate one based on platform name
  return domainMap[cleanPlatform] || `${cleanPlatform.replace(/\s+/g, '')}.com`;
};

// Get platform URL with fallback and validation
export const getPlatformUrl = (platformName?: string): string => {
  if (!platformName) return 'https://example.com';
  
  // Format the platform URL
  const domainName = getPlatformDomain(platformName);
  return `https://${domainName}`;
};

// Format date to be more readable
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};
