
// Master Tools BD Extension Popup Script

document.addEventListener('DOMContentLoaded', function() {
  // Display the extension status
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = 'Extension Active';
    statusElement.className = 'status-active';
  }

  // Add event listener for the open website button
  const openWebsiteButton = document.getElementById('open-website');
  if (openWebsiteButton) {
    openWebsiteButton.addEventListener('click', function() {
      chrome.tabs.create({ url: 'https://mastertoolsbd.com' });
    });
  }

  // Show how many cookies have been set with the extension
  chrome.storage.local.get(['cookieCount'], function(result) {
    const countElement = document.getElementById('cookie-count');
    if (countElement) {
      const count = result.cookieCount || 0;
      countElement.textContent = `${count} platforms accessed`;
    }
  });
});

// Function to update the cookie count when cookies are set
function incrementCookieCount() {
  chrome.storage.local.get(['cookieCount'], function(result) {
    const count = (result.cookieCount || 0) + 1;
    chrome.storage.local.set({ cookieCount: count });
  });
}
