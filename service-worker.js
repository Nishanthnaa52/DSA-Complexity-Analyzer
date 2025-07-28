// service-worker.js

// Set the default icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({
    path: {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png",
    },
  });
});

// Change icon to active state on page load
// This is a simple implementation. A more robust one would check
// if the content script successfully injected.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.action.setIcon({
      path: {
        "16": "images/icon16-active.png",
        "48": "images/icon48-active.png",
        "128": "images/icon128-active.png",
      },
      tabId: tabId
    });
  }
});

// Revert to default icon when the active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.action.setIcon({
        path: {
            "16": "images/icon16.png",
            "48": "images/icon48.png",
            "128": "images/icon128.png",
        }
    });
    // Set the active icon for the newly activated tab
    chrome.action.setIcon({
        path: {
            "16": "images/icon16-active.png",
            "48": "images/icon48-active.png",
            "128": "images/icon128-active.png",
        },
        tabId: activeInfo.tabId
    });
});
