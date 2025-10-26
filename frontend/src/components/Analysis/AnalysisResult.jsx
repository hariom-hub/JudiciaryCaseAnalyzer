import React, { useState } from 'react';
import './AnalysisResult.css';

const AnalysisResult = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState('result');
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content || result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result.content || result.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `analysis-${result.id || Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getProviderIcon = (provider) => {
    const icons = {
      'openai': '🧠',
      'gemini': '💎',
      'groq': '⚡'
    };
    return icons[provider] || '🤖';
  };

  return (
    <div className="analysis-result-container">
      <div className="result-card">
        {/* Header */}
        <div className="result-header">
          <div className="header-left">
            <h2 className="result-title">Analysis Result</h2>
            <div className="result-meta">
              <span className="meta-item">
                <span className="meta-icon">{getProviderIcon(result.provider)}</span>
                <span>{result.providerName || 'AI Provider'}</span>
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-item">{result.analysisType}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">{formatDate(result.timestamp || new Date())}</span>
            </div>
          </div>
          <div className="header-right">
            {onClose && (
              <button className="close-btn" onClick={onClose} title="Close">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Case Info Banner */}
        {result.caseInfo && (
          <div className="case-info-banner">
            <div className="banner-icon">📄</div>
            <div className="banner-content">
              <div className="banner-title">{result.caseInfo.title}</div>
              <div className="banner-subtitle">
                Case #{result.caseInfo.caseNumber} • {result.caseInfo.caseType}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="result-tabs">
          <button 
            className={`tab ${activeTab === 'result' ? 'active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            <span className="tab-icon">📝</span>
            <span>Analysis</span>
          </button>
          <button 
            className={`tab ${activeTab === 'metadata' ? 'active' : ''}`}
            onClick={() => setActiveTab('metadata')}
          >
            <span className="tab-icon">ℹ️</span>
            <span>Details</span>
          </button>
          <button 
            className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            <span className="tab-icon">🔤</span>
            <span>Raw Output</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="result-content">
          {activeTab === 'result' && (
            <div className="result-text">
              <div className="text-content">
                {result.content || result.text || 'No analysis content available.'}
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="result-metadata">
              <div className="metadata-grid">
                <div className="metadata-item">
                  <div className="metadata-label">Provider</div>
                  <div className="metadata-value">
                    <span className="provider-icon">{getProviderIcon(result.provider)}</span>
                    {result.providerName || 'Unknown'}
                  </div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Model</div>
                  <div className="metadata-value">{result.model || 'Default'}</div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Analysis Type</div>
                  <div className="metadata-value">{result.analysisType}</div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Status</div>
                  <div className="metadata-value">
                    <span className="status-badge completed">Completed</span>
                  </div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Duration</div>
                  <div className="metadata-value">{result.duration || 'N/A'}</div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Tokens Used</div>
                  <div className="metadata-value">{result.tokensUsed?.toLocaleString() || '0'}</div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Created At</div>
                  <div className="metadata-value">{formatDate(result.timestamp || new Date())}</div>
                </div>

                <div className="metadata-item">
                  <div className="metadata-label">Analysis ID</div>
                  <div className="metadata-value">{result.id || 'N/A'}</div>
                </div>
              </div>

              {result.prompt && (
                <div className="prompt-section">
                  <h3 className="prompt-title">Original Prompt</h3>
                  <div className="prompt-content">
                    {result.prompt}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="result-raw">
              <pre className="raw-content">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="result-actions">
          <div className="actions-left">
            <button className="action-btn" onClick={handleCopy}>
              <span className="btn-icon">{copied ? '✓' : '📋'}</span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button className="action-btn" onClick={handleDownload}>
              <span className="btn-icon">⬇️</span>
              <span>Download</span>
            </button>
            <button className="action-btn" onClick={() => window.print()}>
              <span className="btn-icon">🖨️</span>
              <span>Print</span>
            </button>
          </div>

          <div className="actions-right">
            <button className="action-btn" onClick={() => alert('Share functionality coming soon!')}>
              <span className="btn-icon">📤</span>
              <span>Share</span>
            </button>
            <button className="action-btn primary" onClick={() => alert('Regenerate functionality coming soon!')}>
              <span className="btn-icon">🔄</span>
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Quality Feedback */}
        <div className="quality-feedback">
          <div className="feedback-label">Was this analysis helpful?</div>
          <div className="feedback-buttons">
            <button className="feedback-btn" onClick={() => alert('Thank you for your feedback!')}>
              <span className="feedback-icon">👍</span>
              <span>Yes</span>
            </button>
            <button className="feedback-btn" onClick={() => alert('Thank you for your feedback!')}>
              <span className="feedback-icon">👎</span>
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;