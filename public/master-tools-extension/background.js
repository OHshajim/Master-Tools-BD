
// Master Tools BD Extension - Background Script
// This script handles the main functionality of the extension

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "SET_COOKIES") {
    const { domain, cookieData } = message.payload;
    
    try {
      console.log("Setting cookies for domain:", domain);
      
      // Parse the cookie data
      const cookies = JSON.parse(cookieData);
      
      // Set each cookie
      const cookiePromises = cookies.map(cookie => {
        console.log("Setting cookie:", cookie.name);
        
        return chrome.cookies.set({
          url: `https://${domain}`,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain || `.${domain}`,
          path: cookie.path || '/',
          secure: cookie.secure || true,
          httpOnly: cookie.httpOnly || false,
          sameSite: cookie.sameSite || 'lax',
          expirationDate: cookie.expirationDate || (Date.now() / 1000) + 86400 * 30, // 30 days default
        });
      });
      
      Promise.all(cookiePromises)
        .then(() => {
          console.log("All cookies set successfully, opening domain:", domain);
          // After setting all cookies, open the domain in a new tab
          chrome.tabs.create({ url: `https://${domain}` });
          
          // Increment the cookie count
          chrome.storage.local.get(['cookieCount'], function(result) {
            const count = (result.cookieCount || 0) + 1;
            chrome.storage.local.set({ cookieCount: count });
            console.log("Cookie count incremented to:", count);
          });
          
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error('Error setting cookies:', error);
          sendResponse({ success: false, error: error.message });
        });
    } catch (error) {
      console.error('Error processing cookies:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep the message channel open for the async response
  }
});

// Extension installation handler
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    console.log("Extension installed! Opening welcome page");
    // Open a welcome page when the extension is first installed
    chrome.tabs.create({
      url: "welcome.html"
    });
  } else if (details.reason === "update") {
    console.log("Extension updated");
  }
});

// Add browser action click handler
chrome.action.onClicked.addListener(function(tab) {
  console.log("Extension icon clicked");
  // Notify the page that the extension is active
  chrome.tabs.sendMessage(tab.id, { type: "EXTENSION_ACTIVATED" });
});

console.log("Background script loaded");
