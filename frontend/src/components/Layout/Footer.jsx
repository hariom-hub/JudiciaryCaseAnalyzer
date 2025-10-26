import React, { useState } from 'react';
import './Footer.css';

const Footer = ({ onNavigate }) => {
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // System status data
  const systemStatus = {
    api: { status: 'operational', uptime: '99.9%' },
    openai: { status: 'operational', uptime: '99.7%' },
    gemini: { status: 'operational', uptime: '99.8%' },
    groq: { status: 'operational', uptime: '99.6%' },
    database: { status: 'operational', uptime: '99.9%' }
  };

  const quickLinks = [
    { label: 'Dashboard', action: () => onNavigate('dashboard'), icon: '📊' },
    { label: 'Cases', action: () => onNavigate('cases'), icon: '📋' },
    { label: 'AI Analysis', action: () => onNavigate('analysis'), icon: '🤖' },
    { label: 'Add Case', action: () => onNavigate('add-case'), icon: '➕' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', action: () => alert('Privacy Policy'), icon: '🔒' },
    { label: 'Terms of Service', action: () => alert('Terms of Service'), icon: '📄' },
    { label: 'Data Protection', action: () => alert('Data Protection'), icon: '🛡️' },
    { label: 'Cookie Policy', action: () => alert('Cookie Policy'), icon: '🍪' }
  ];

  const supportLinks = [
    { label: 'Help Center', action: () => alert('Help Center'), icon: '❓' },
    { label: 'API Documentation', action: () => alert('API Docs'), icon: '📚' },
    { label: 'Contact Support', action: () => alert('Contact Support'), icon: '💬' },
    { label: 'Community Forum', action: () => alert('Community Forum'), icon: '👥' }
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      alert('Thank you for your feedback! We appreciate your input.');
      setFeedbackText('');
      setShowFeedbackForm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational': return 'All Systems Operational';
      case 'degraded': return 'Degraded Performance';
      case 'down': return 'Service Unavailable';
      default: return 'Unknown Status';
    }
  };

  return (
    <footer className="app-footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-section">
          {/* Company/Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">⚖️</span>
              <div className="footer-logo-text">
                <span className="footer-brand-name">Judiciary Analyzer</span>
                <span className="footer-brand-tagline">AI-Powered Legal Intelligence</span>
              </div>
            </div>
            <p className="footer-description">
              Empowering legal professionals with cutting-edge AI technology for 
              case analysis, document processing, and intelligent legal research.
            </p>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Cases Analyzed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Legal Professionals</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Quick Access</h4>
            <div className="footer-links-list">
              {quickLinks.map((link, index) => (
                <button 
                  key={index}
                  className="footer-link"
                  onClick={link.action}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-text">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Legal & Privacy</h4>
            <div className="footer-links-list">
              {legalLinks.map((link, index) => (
                <button 
                  key={index}
                  className="footer-link"
                  onClick={link.action}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-text">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Support & Resources</h4>
            <div className="footer-links-list">
              {supportLinks.map((link, index) => (
                <button 
                  key={index}
                  className="footer-link"
                  onClick={link.action}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-text">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="footer-feedback">
            <h4 className="footer-links-title">Share Your Feedback</h4>
            {!showFeedbackForm ? (
              <button 
                className="feedback-trigger"
                onClick={() => setShowFeedbackForm(true)}
              >
                <span className="feedback-icon">💭</span>
                <div className="feedback-text">
                  <span className="feedback-title">Send Feedback</span>
                  <span className="feedback-subtitle">Help us improve</span>
                </div>
              </button>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us about your experience or suggest improvements..."
                  className="feedback-textarea"
                  rows={3}
                />
                <div className="feedback-actions">
                  <button 
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setFeedbackText('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Send Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          {/* Left Side - Copyright and Version */}
          <div className="footer-bottom-left">
            <div className="copyright">
              <span>© 2024 Judiciary Analyzer. All rights reserved.</span>
            </div>
            <div className="version-info">
              <span className="version-label">Version:</span>
              <span className="version-number">1.0.0</span>
              <span className="build-info">Build 2024.09.24</span>
            </div>
          </div>

          {/* Center - System Status */}
          <div className="footer-bottom-center">
            <div className="system-status-container">
              <button 
                className="system-status-btn"
                onClick={() => setIsSystemStatusOpen(!isSystemStatusOpen)}
                title="View System Status"
              >
                <div className="status-indicator operational"></div>
                <span className="status-text">{getStatusText('operational')}</span>
                <span className="status-arrow">▲</span>
              </button>

              {isSystemStatusOpen && (
                <div className="system-status-dropdown">
                  <div className="status-dropdown-header">
                    <h4>System Status</h4>
                    <button 
                      className="close-status"
                      onClick={() => setIsSystemStatusOpen(false)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="status-services">
                    {Object.entries(systemStatus).map(([service, data]) => (
                      <div key={service} className="status-service">
                        <div className="service-info">
                          <span className="service-name">
                            {service === 'api' ? 'API Server' :
                             service === 'openai' ? 'OpenAI' :
                             service === 'gemini' ? 'Google Gemini' :
                             service === 'groq' ? 'Groq' :
                             service === 'database' ? 'Database' : service}
                          </span>
                          <span className="service-uptime">{data.uptime} uptime</span>
                        </div>
                        <div 
                          className="service-status-indicator"
                          style={{ backgroundColor: getStatusColor(data.status) }}
                          title={data.status}
                        ></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="status-dropdown-footer">
                    <button className="status-details-btn">
                      View Detailed Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Social and External Links */}
          <div className="footer-bottom-right">
            <div className="social-links">
              <button className="social-link" title="GitHub">
                <span className="social-icon">🐙</span>
              </button>
              <button className="social-link" title="Documentation">
                <span className="social-icon">📖</span>
              </button>
              <button className="social-link" title="LinkedIn">
                <span className="social-icon">💼</span>
              </button>
              <button className="social-link" title="Twitter">
                <span className="social-icon">🐦</span>
              </button>
            </div>
            
            <div className="external-links">
              <button className="external-link">
                <span className="external-icon">🌐</span>
                <span className="external-text">Visit Website</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Providers Attribution */}
      <div className="ai-attribution">
        <div className="attribution-content">
          <span className="attribution-text">Powered by:</span>
          <div className="ai-providers">
            <div className="ai-provider">
              <span className="provider-icon">🧠</span>
              <span className="provider-name">OpenAI</span>
            </div>
            <div className="ai-provider">
              <span className="provider-icon">💎</span>
              <span className="provider-name">Google Gemini</span>
            </div>
            <div className="ai-provider">
              <span className="provider-icon">⚡</span>
              <span className="provider-name">Groq</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="keyboard-shortcuts-hint">
        <button 
          className="shortcuts-btn"
          onClick={() => alert('Keyboard Shortcuts:\n• Ctrl/Cmd + K: Search\n• Ctrl/Cmd + N: New Case\n• Ctrl/Cmd + A: AI Analysis')}
          title="View Keyboard Shortcuts"
        >
          <span className="shortcuts-icon">⌨️</span>
          <span className="shortcuts-text">Shortcuts</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;