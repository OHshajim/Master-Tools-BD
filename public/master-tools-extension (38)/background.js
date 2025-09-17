// Master Tools BD Extension - Background Script
// This script handles the main functionality of the extension

// Listen for messages from the content script
// import { CookieEditor } from 'https://unpkg.com/cookie-editor/dist/cookie-editor.min.js';
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "SET_COOKIES") {
    const { domain, cookieData } = message.payload;
    
    try {
      console.log("Setting cookies for domain:", domain);
      
      // Parse the cookie data
      const cookies = JSON.parse(cookieData);
      
      // Set each cookie
      const cookiePromises= cookies.map(cookie => {
       
        console.log(cookie.domain)
        return chrome.cookies.set({
          domain: cookie.domain || '',
      name: cookie.name || '',
      value: cookie.value || '',
      path: cookie.path || '/',
      secure: cookie.secure || null,
      httpOnly: cookie.httpOnly || null,
      expirationDate: cookie.expirationDate || null,
      storeId: cookie.storeId || (this.currentTab ? this.currentTab.cookieStoreId || '0' : '0'),
      url: domain,
          
          
        });
      });
      
      Promise.all(cookiePromises)
        .then(() => {
          console.log("All cookies set successfully, opening domain:", domain);
          // After setting all cookies, open the domain in a new tab
       
          
          // Increment the cookie count
          chrome.storage.local.get(['cookieCount'], function(result) {
            const count = (result.cookieCount || 0) + 1;
            chrome.storage.local.set({ cookieCount: count });
            console.log("Cookie count incremented to:", count);
          });
          
          sendResponse({ success: true });
          return chrome.tabs.create({ url: domain });
        })
        .catch(error => {
          console.error('Error setting cookies:', error);

          sendResponse({ success: false, error: error.message });
         return chrome.tabs.create({ url: domain });
        });
    } catch (error) {
      console.error('Error processing cookies:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep the message channel open for the async response
  }
  
  // Handle the new platform access API
  if (message.type === "ACCESS") {
    const { platform, token, platformData } = message.payload;
    
    try {
      console.log("Accessing platform:", platform);
      
      // If platformData is already provided, use it directly
      if (platformData) {
        processPlatformData(platformData, sendResponse);
      } 
      // Otherwise fetch it from the API
      else {
        fetchPlatformData(platform, token)
          .then(data => processPlatformData(data, sendResponse))
          .catch(error => {
            console.error('Error fetching platform data:', error);
            sendResponse({ success: false, error: error.message });
          });
      }
    } catch (error) {
      console.error('Error processing platform access:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep the message channel open for the async response
  }
});

// Function to fetch platform data from the API
async function fetchPlatformData(platform, token) {
  const apiUrl = `https://tbd.secureguardwave.com/api/cookies/latest?platform=${platform}`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication expired. Please log in again.');
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

// Function to process platform data and set cookies
async function processPlatformData(data, sendResponse) {
  try {
    const { domain, redirect, cookies } = data;
   
    // Set each cookie
    for (const cookie of cookies) {
      // await chrome.cookies.set({
        console.log(redirect,cookie.domain)
        await chrome.cookies.set({
          url: `https://${chatgpt.com}`,
          name: cookie.name,
          value: "sds",
          domain: cookie.domain , // Ensure domain is properly set
          path: cookie.path || '/', // Default to root path
          // secure: cookie.secure !== undefined ? cookie.secure : true, // Defaults to true for secure cookies
          // httpOnly:  false, // Defaults to false for general cookies
          // sameSite: cookie.sameSite || "no_restriction", // Default to "no_restriction" for compatibility
          expirationDate:  (Date.now() / 1000) + 86400 * 30, // Default to 30 days expiration if not provided
          // session: cookie.session || false, // Defaults to false, making the cookie persistent unless specified
        });
      //   url: `https://${cookie.domain || domain}${cookie.path || "/"}`,
      //   name: cookie.name,
      //   value: cookie.value,
      //   domain: cookie.domain || `.${domain}`,
      //   path: cookie.path || '/',
      //   secure: true,
      //   httpOnly: false,
      //   sameSite: "no_restriction",
      //   expirationDate: cookie.expires || (Date.now() / 1000) + 86400 * 30 // 30 days default
      // });
    }
    
    // Open in a new tab
    chrome.tabs.create({ url: redirect || `https://${domain}` });
    
    // Increment the access count
    chrome.storage.local.get(['accessCount'], function(result) {
      const count = (result.accessCount || 0) + 1;
      chrome.storage.local.set({ accessCount: count });
      console.log("Access count incremented to:", count);
    });
    
    sendResponse({ success: true });
    
  } catch (error) {
    console.error('Error processing platform data:', error);
    sendResponse({ success: false, error: error.message });
  }
}

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

