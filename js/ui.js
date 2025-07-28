// js/ui.js

class UI {
  constructor() {
    this.elements = {
      // Views
      analyzerView: document.getElementById('analyzer-view'),
      settingsView: document.getElementById('settings-view'),
      // Buttons
      analyzeBtn: document.getElementById('analyze-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      backToAnalyzerBtn: document.getElementById('back-to-analyzer-btn'),
      saveSettingsBtn: document.getElementById('save-settings-btn'),
      // Main View
      llmSelect: document.getElementById('llm-select'),
      resultContainer: document.getElementById('result-container'),
      timeResult: document.getElementById('time-complexity-result'),
      spaceResult: document.getElementById('space-complexity-result'),
      explanationResult: document.getElementById('explanation-result'),
      onboardingMessage: document.getElementById('onboarding-message'),
      setupNotice: document.querySelector('.setup-notice'),
      // Settings View
      geminiApiKeyInput: document.getElementById('gemini-api-key-input'),
      openaiApiKeyInput: document.getElementById('openai-api-key-input'),
      localApiKeyInput: document.getElementById('local-api-key-input'),
      themeSelect: document.getElementById('theme-select'),
      settingsStatus: document.getElementById('settings-status'),
    };
  }

  // --- View Management ---
  showAnalyzerView() {
    this.elements.analyzerView.style.display = 'block';
    this.elements.settingsView.style.display = 'none';
  }

  showSettingsView() {
    this.elements.analyzerView.style.display = 'none';
    this.elements.settingsView.style.display = 'block';
  }

  // --- Theme Management ---
  applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    if (theme === 'light' || theme === 'dark') {
      document.body.classList.add(`theme-${theme}`);
    }
    // If theme is 'system', we don't add any class, and the CSS media query will handle it.
  }

  // --- State Updates ---
  setLoading(isLoading) {
    this.elements.analyzeBtn.disabled = isLoading;
    this.elements.analyzeBtn.textContent = isLoading ? 'Analyzing...' : 'Analyze Selected Code';
  }

  displayResult(result) {
    this.elements.resultContainer.style.display = 'block';
    this.elements.onboardingMessage.style.display = 'none';
    if (result && !result.error) {
      this.elements.timeResult.textContent = result.time || 'N/A';
      this.elements.spaceResult.textContent = result.space || 'N/A';
      this.elements.explanationResult.textContent = result.explanation || 'No explanation provided.';
    } else {
      this.elements.timeResult.textContent = 'Error';
      this.elements.spaceResult.textContent = 'Error';
      this.elements.explanationResult.textContent = result.error || 'An unknown error occurred.';
    }
  }
  
  showSetupNotice(visible) {
      this.elements.setupNotice.style.display = visible ? 'block' : 'none';
  }

  // --- Settings Form ---
  populateSettings(settings) {
    this.elements.llmSelect.value = settings.selectedLlm || 'gemini';
    this.elements.themeSelect.value = settings.theme || 'system';
    this.elements.geminiApiKeyInput.value = settings.apiKeys?.gemini || '';
    this.elements.openaiApiKeyInput.value = settings.apiKeys?.openai || '';
    this.elements.localApiKeyInput.value = settings.apiKeys?.local || '';
    this.applyTheme(settings.theme || 'system');
  }

  getSettingsFromForm() {
    return {
      selectedLlm: this.elements.llmSelect.value,
      theme: this.elements.themeSelect.value,
      apiKeys: {
        gemini: this.elements.geminiApiKeyInput.value.trim(),
        openai: this.elements.openaiApiKeyInput.value.trim(),
        local: this.elements.localApiKeyInput.value.trim(),
      }
    };
  }
  
  showSettingsStatus(message, isError = false) {
      this.elements.settingsStatus.textContent = message;
      this.elements.settingsStatus.style.color = isError ? 'var(--error-color)' : 'var(--primary-color)';
      setTimeout(() => {
          this.elements.settingsStatus.textContent = '';
      }, 3000);
  }
}

window.ui = new UI();
