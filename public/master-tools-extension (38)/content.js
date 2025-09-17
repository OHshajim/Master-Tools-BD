
// Master Tools BD Extension - Content Script
// This script communicates between the web page and the extension

// Listen for messages from the webpage
window.addEventListener("message", function(event) {
  // Only accept messages from our web app domains
  if (event.origin.includes('mastertoolsbd.xyz') || 
      event.origin.includes('localhost') ||
      event.data.type === "MASTER_TOOLS_CHECK_EXTENSION") {
    
    // Check extension presence request
    if (event.data.type === "MASTER_TOOLS_CHECK_EXTENSION") {
      window.postMessage({ type: "MASTER_TOOLS_EXTENSION_PRESENT" }, "*");
      console.log("Extension presence check received and confirmed");
    }
    
    // Set cookies request
    if (event.data.type === "MASTER_TOOLS_SET_COOKIES") {
      // Show status to user
      window.postMessage({ 
        type: "MASTER_TOOLS_COOKIES_STATUS", 
        status: "Injecting cookies and redirecting..."
      }, "*");
      
      console.log("Cookie injection request received");
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: "SET_COOKIES",
        payload: event.data.payload
      }, function(response) {
        // Send response back to webpage
        window.postMessage({
          type: "MASTER_TOOLS_COOKIES_RESULT",
          success: response?.success || false,
          error: response?.error || "Unknown error"
        }, "*");
        
        console.log("Cookie injection result:", response?.success ? "Success" : "Failed");
      });
    }
    
    // Access platform request (new API)
    if (event.data.type === "MASTER_TOOLS_ACCESS_PLATFORM") {
      // Show status to user
      window.postMessage({ 
        type: "MASTER_TOOLS_COOKIES_STATUS", 
        status: "Accessing platform..."
      }, "*");
      
      console.log("Platform access request received");
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: "ACCESS",
        payload: event.data.payload
      }, function(response) {
        // Send response back to webpage
        window.postMessage({
          type: "MASTER_TOOLS_PLATFORM_ACCESS_RESULT",
          success: response?.success || false,
          error: response?.error || "Unknown error"
        }, "*");
        
        console.log("Platform access result:", response?.success ? "Success" : "Failed");
      });
    }
  }
});

// Listen for messages from the extension background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "EXTENSION_ACTIVATED") {
    // Notify the webpage that the extension has been activated
    window.postMessage({ type: "MASTER_TOOLS_EXTENSION_ACTIVATED" }, "*");
    console.log("Extension activated message received");
  }
});

// Notify the page immediately that the extension is present
console.log("Content script loaded, notifying page of extension presence");
window.postMessage({ type: "MASTER_TOOLS_EXTENSION_PRESENT" }, "*");
