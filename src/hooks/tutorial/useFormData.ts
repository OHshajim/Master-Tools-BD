
import { useState, useEffect } from 'react';
import { TutorialVideo } from '@/types/access';

export const useFormData = (
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile', 
  existingVideo: TutorialVideo | undefined
) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Reset form with existing data if available
  useEffect(() => {
    if (existingVideo) {
      setTitle(existingVideo.title);
      setDescription(existingVideo.description);
    } else {
      // Default titles and descriptions based on type
      if (type === 'login') {
        setTitle('Getting Started with Login Credentials');
        setDescription('Learn how to use login credentials for various platforms');
      } else if (type === 'cookie') {
        setTitle('Getting Started with Cookie Credentials');
        setDescription('Watch this tutorial to learn how to use cookie credentials');
      } else if (type === 'login-mobile') {
        setTitle('Using Login Credentials on Mobile Devices');
        setDescription('Learn how to use login credentials on your smartphone or tablet');
      } else if (type === 'cookie-mobile') {
        setTitle('Using Cookie Credentials on Mobile Devices');
        setDescription('Watch this tutorial to learn how to use cookie credentials on your mobile device');
      }
    }
  }, [existingVideo, type]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  return {
    title,
    description,
    handleTitleChange,
    handleDescriptionChange
  };
};
