// This script runs in the context of the web page.
// It doesn't have direct access to the popup's DOM.
// We can use it to listen for messages from the popup or to send messages to the popup.

// For this extension, the popup directly injects a script to get the selected text,
// so this file is currently not used for that purpose.
// However, we'll keep it for future features, such as real-time selection detection.
