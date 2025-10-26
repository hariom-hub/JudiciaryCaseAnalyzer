import React, { useState } from 'react';

const AnalysisForm = ({ selectedCase, onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    analysisType: 'summary',
    apiKey: '',
    customPrompt: ''
  });

  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.apiKey && formData.provider !== 'mock') {
      alert('Please enter your API key');
      setShowApiKeyInput(true);
      return;
    }

    if (formData.analysisType === 'custom' && !formData.customPrompt.trim()) {
      alert('Please enter a custom prompt');
      return;
    }

    // Call parent analyze function
    onAnalyze({
      provider: formData.provider,
      model: formData.model,
      analysisType: formData.analysisType,
      apiKey: formData.apiKey,
      prompt: formData.analysisType === 'custom' ? formData.customPrompt : null,
      caseData: selectedCase
    });
  };

  const analysisTypes = [
    { value: 'summary', label: '📋 Case Summary', description: 'Generate a comprehensive summary of the case' },
    { value: 'legal_issues', label: '⚖️ Legal Issues', description: 'Identify key legal issues and questions' },
    { value: 'precedents', label: '📚 Precedents', description: 'Find relevant case law and precedents' },
    { value: 'outcome_prediction', label: '🎯 Outcome Prediction', description: 'Predict likely case outcomes' },
    { value: 'strengths_weaknesses', label: '💪 Strengths & Weaknesses', description: 'Analyze case strengths and weaknesses' },
    { value: 'custom', label: '✍️ Custom Analysis', description: 'Create your own analysis prompt' }
  ];

  const aiProviders = [
    { value: 'openai', label: 'OpenAI (GPT)', models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] },
    { value: 'gemini', label: 'Google Gemini', models: ['gemini-pro', 'gemini-1.5-pro'] },
    { value: 'groq', label: 'Groq', models: ['llama3-70b-8192', 'mixtral-8x7b-32768'] },
    { value: 'mock', label: '🧪 Mock (Demo)', models: ['demo'] }
  ];

  const selectedProvider = aiProviders.find(p => p.value === formData.provider);
  const availableModels = selectedProvider ? selectedProvider.models : [];

  return (
    <div className="analysis-form-container">
      <div className="selected-case-info">
        <h3>Selected Case</h3>
        <div className="case-info-card">
          <div className="info-row">
            <span className="label">Title:</span>
            <span className="value">{selectedCase?.title || 'No case selected'}</span>
          </div>
          {selectedCase?.caseNumber && (
            <div className="info-row">
              <span className="label">Case Number:</span>
              <span className="value">{selectedCase.caseNumber}</span>
            </div>
          )}
          {selectedCase?.caseType && (
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">{selectedCase.caseType}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="analysis-form">
        <h3>AI Analysis Configuration</h3>

        {/* AI Provider Selection */}
        <div className="form-group">
          <label htmlFor="provider">
            <span className="label-icon">🤖</span>
            AI Provider
          </label>
          <select
            id="provider"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            disabled={isLoading}
            required
          >
            {aiProviders.map(provider => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
          <small className="form-hint">
            {formData.provider === 'mock' 
              ? '⚠️ Demo mode - No actual API calls will be made'
              : 'Choose your preferred AI provider'}
          </small>
        </div>

        {/* Model Selection */}
        <div className="form-group">
          <label htmlFor="model">
            <span className="label-icon">🧠</span>
            Model
          </label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            disabled={isLoading}
            required
          >
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* API Key Input */}
        {formData.provider !== 'mock' && (
          <div className="form-group">
            <label htmlFor="apiKey">
              <span className="label-icon">🔑</span>
              API Key
              <button
                type="button"
                className="toggle-visibility-btn"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              >
                {showApiKeyInput ? '👁️' : '👁️‍🗨️'}
              </button>
            </label>
            <input
              type={showApiKeyInput ? "text" : "password"}
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder={`Enter your ${selectedProvider?.label} API key`}
              disabled={isLoading}
              required={formData.provider !== 'mock'}
            />
            <small className="form-hint">
              Your API key is not stored and used only for this analysis
            </small>
          </div>
        )}

        {/* Analysis Type Selection */}
        <div className="form-group">
          <label>
            <span className="label-icon">📊</span>
            Analysis Type
          </label>
          <div className="analysis-types-grid">
            {analysisTypes.map(type => (
              <label
                key={type.value}
                className={`analysis-type-card ${formData.analysisType === type.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="analysisType"
                  value={type.value}
                  checked={formData.analysisType === type.value}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="type-content">
                  <div className="type-label">{type.label}</div>
                  <div className="type-description">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input */}
        {formData.analysisType === 'custom' && (
          <div className="form-group">
            <label htmlFor="customPrompt">
              <span className="label-icon">✍️</span>
              Custom Prompt
            </label>
            <textarea
              id="customPrompt"
              name="customPrompt"
              value={formData.customPrompt}
              onChange={handleChange}
              placeholder="Enter your custom analysis prompt here..."
              rows={5}
              disabled={isLoading}
              required={formData.analysisType === 'custom'}
            />
            <small className="form-hint">
              Describe what specific analysis you want to perform on this case
            </small>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading || !selectedCase}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Start Analysis
              </>
            )}
          </button>
        </div>

        {/* Info Alert */}
        {formData.provider === 'mock' && (
          <div className="alert alert-info">
            <strong>ℹ️ Demo Mode:</strong> This will generate a mock analysis without making actual API calls. 
            Perfect for testing the interface!
          </div>
        )}
      </form>

      <style jsx>{`
        .analysis-form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .selected-case-info {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .selected-case-info h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .case-info-card {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .info-row {
          display: flex;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          font-weight: 600;
          color: #666;
          min-width: 120px;
        }

        .info-row .value {
          color: #333;
        }

        .analysis-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .analysis-form h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .label-icon {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        .toggle-visibility-btn {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
        }

        .form-group select,
        .form-group input[type="text"],
        .form-group input[type="password"],
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group select:focus,
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .form-group select:disabled,
        .form-group input:disabled,
        .form-group textarea:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .form-hint {
          display: block;
          margin-top: 0.25rem;
          color: #666;
          font-size: 0.875rem;
        }

        .analysis-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .analysis-type-card {
          position: relative;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .analysis-type-card:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0,123,255,0.2);
        }

        .analysis-type-card.selected {
          border-color: #007bff;
          background-color: #e7f3ff;
        }

        .analysis-type-card input[type="radio"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .type-content {
          pointer-events: none;
        }

        .type-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #333;
        }

        .type-description {
          font-size: 0.875rem;
          color: #666;
        }

        .form-actions {
          margin-top: 2rem;
          text-align: center;
        }

        .btn {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff40;
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .alert {
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
        }

        .alert-info {
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
      `}</style>
    </div>
  );
};

export default AnalysisForm;