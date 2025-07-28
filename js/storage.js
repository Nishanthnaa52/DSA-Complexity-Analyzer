// js/storage.js

const storage = {
  // Get all settings
  getSettings: async () => {
    const result = await browser.storage.local.get({
      selectedLlm: 'gemini',
      theme: 'system',
      apiKeys: {},
    });
    return result;
  },

  // Save all settings
  saveSettings: async (settings) => {
    return browser.storage.local.set(settings);
  },

  // Get a specific API key
  getApiKey: async (llm) => {
    const { apiKeys = {} } = await storage.getSettings();
    return apiKeys[llm];
  },

  // Save a specific API key
  saveApiKey: async (llm, key) => {
    const { apiKeys = {} } = await storage.getSettings();
    apiKeys[llm] = key;
    return storage.saveSettings({ apiKeys });
  },
  
  // Get the selected LLM
  getSelectedLlm: async () => {
    const { selectedLlm = 'gemini' } = await storage.getSettings();
    return selectedLlm;
  },

  // Save the selected LLM
  saveSelectedLlm: async (llm) => {
    return storage.saveSettings({ selectedLlm: llm });
  }
};

window.appStorage = storage;
