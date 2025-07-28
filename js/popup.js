// js/popup.js

document.addEventListener('DOMContentLoaded', () => {
  const { ui, appStorage, geminiApi, openaiApi, localApi } = window;

  const apiClients = {
    gemini: geminiApi,
    openai: openaiApi,
    local: localApi,
  };

  async function initialize() {
    const settings = await appStorage.getSettings();
    ui.populateSettings(settings);
    updateOnboardingMessage();
    addEventListeners();
  }

  function addEventListeners() {
    ui.elements.analyzeBtn.addEventListener('click', handleAnalyze);
    ui.elements.settingsBtn.addEventListener('click', () => ui.showSettingsView());
    ui.elements.backToAnalyzerBtn.addEventListener('click', () => ui.showAnalyzerView());
    ui.elements.saveSettingsBtn.addEventListener('click', handleSaveSettings);
    ui.elements.llmSelect.addEventListener('change', updateOnboardingMessage);
    ui.elements.themeSelect.addEventListener('change', () => {
      const selectedTheme = ui.elements.themeSelect.value;
      ui.applyTheme(selectedTheme);
    });
  }

  async function handleAnalyze() {
    ui.setLoading(true);
    const selectedLlm = ui.elements.llmSelect.value;
    const apiKey = await appStorage.getApiKey(selectedLlm);

    if (!apiKey) {
      ui.displayResult({ error: `API key for ${selectedLlm} is not set. Please add it in the settings.` });
      ui.setLoading(false);
      return;
    }

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => window.getSelection().toString(),
    });

    const selectedCode = injectionResults?.[0]?.result;
    if (selectedCode) {
      const apiClient = apiClients[selectedLlm];
      const result = await apiClient.analyzeCode(apiKey, selectedCode);
      ui.displayResult(result);
    } else {
      ui.displayResult({ error: 'No code selected. Please select some code on the page.' });
    }
    ui.setLoading(false);
  }

  async function handleSaveSettings() {
    const newSettings = ui.getSettingsFromForm();
    const selectedLlm = newSettings.selectedLlm;
    const apiKey = newSettings.apiKeys[selectedLlm];
    const apiClient = apiClients[selectedLlm];

    // Verify the key for the currently selected LLM if it's provided
    if (apiKey) {
      const verificationResult = await apiClient.verifyApiKey(apiKey);
      if (!verificationResult.isValid) {
        const errorMessage = `API Key for ${selectedLlm} is invalid. Reason: ${verificationResult.error}`;
        ui.showSettingsStatus(errorMessage, true);
        return;
      }
    }
    
    await appStorage.saveSettings(newSettings);
    ui.showSettingsStatus('Settings saved successfully!');
    updateOnboardingMessage();
  }
  
  async function updateOnboardingMessage() {
      const selectedLlm = ui.elements.llmSelect.value;
      const apiKey = await appStorage.getApiKey(selectedLlm);
      ui.showSetupNotice(!apiKey);
  }

  initialize();
});
