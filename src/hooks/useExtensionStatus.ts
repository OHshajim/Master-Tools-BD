
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export interface ExtensionStatus {
  isInstalled: boolean;
  statusMessage: string;
}

/**
 * Custom hook to handle browser extension detection and communication
 */
export const useExtensionStatus = (): ExtensionStatus & {
  checkExtensionInstalled: () => void;
  handleDirectAccess: (domain: string, cookieData: string) => void;
} => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Function to check if our extension is installed
  const checkExtensionInstalled = () => {
    try {
      // Try to communicate with our extension
      window.postMessage({ type: "MASTER_TOOLS_CHECK_EXTENSION" }, "*");
      
      // Set a timeout to assume extension is not installed if no response
      setTimeout(() => {
        // This will fire only if the extension message listener doesn't set extensionInstalled to true
        if (!isInstalled) {
          console.log("Extension not detected within timeout");
        }
      }, 1000);
    } catch (error) {
      console.error("Error checking extension:", error);
    }
  };

  // Handle direct access with cookies
  const handleDirectAccess = (domain: string, cookieData: string) => {
    try {
      if (isInstalled) {
        // If extension is installed, send message to extension
        window.postMessage({
          type: "MASTER_TOOLS_SET_COOKIES",
          payload: {
            domain,
            cookieData
          }
        }, "*");
        
        toast.success(`Accessing ${domain} with the extension.`);
        setStatusMessage('Injecting cookies and redirecting...');
      } else {
        toast.error('Please install the extension first to access platforms.');
      }
    } catch (error) {
      console.error('Error accessing platform:', error);
      toast.error('Failed to access platform. Try installing our extension.');
    }
  };

  useEffect(() => {
    // Check if the extension is installed on mount
    checkExtensionInstalled();
    
    // Listen for messages from the extension
    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === "MASTER_TOOLS_EXTENSION_PRESENT") {
        setIsInstalled(true);
      } 
      else if (event.data.type === "MASTER_TOOLS_EXTENSION_ACTIVATED") {
        toast.success("Extension activated! You can now access platforms.");
      }
      else if (event.data.type === "MASTER_TOOLS_COOKIES_STATUS") {
        setStatusMessage(event.data.status);
      }
      else if (event.data.type === "MASTER_TOOLS_COOKIES_RESULT") {
        if (event.data.success) {
          setStatusMessage('Access successful!');
        } else {
          setStatusMessage(`Error: ${event.data.error || 'Failed to set cookies'}`);
          toast.error('Failed to set cookies. Please try again.');
        }
      }
    };
    
    window.addEventListener("message", messageHandler);
    
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  return {
    isInstalled,
    statusMessage,
    checkExtensionInstalled,
    handleDirectAccess
  };
};
