import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, onNavigate, isCollapsed, onToggleCollapse }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalCases: 0,
    pendingAnalyses: 0,
    aiCredits: 0
  });

  // Navigation items with enhanced metadata
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊', 
      description: 'Overview and analytics',
      badge: null,
      shortcut: 'Ctrl+D'
    },
    { 
      id: 'cases', 
      label: 'Legal Cases', 
      icon: '📋', 
      description: 'Manage all cases',
      badge: quickStats.totalCases > 0 ? quickStats.totalCases : null,
      shortcut: 'Ctrl+C'
    },
    { 
      id: 'add-case', 
      label: 'Add New Case', 
      icon: '➕', 
      description: 'Create new case',
      badge: null,
      shortcut: 'Ctrl+N'
    },
    { 
      id: 'analysis', 
      label: 'AI Analysis', 
      icon: '🤖', 
      description: 'Run AI analysis',
      badge: quickStats.pendingAnalyses > 0 ? `${quickStats.pendingAnalyses} pending` : null,
      shortcut: 'Ctrl+A'
    }
  ];

  const toolsItems = [
    {
      id: 'document-parser',
      label: 'Document Parser',
      icon: '📄',
      description: 'Extract text from documents',
      action: () => alert('Document Parser - Coming Soon!')
    },
    {
      id: 'precedent-finder',
      label: 'Precedent Finder',
      icon: '🔍',
      description: 'Find similar cases',
      action: () => alert('Precedent Finder - Coming Soon!')
    },
    {
      id: 'legal-calendar',
      label: 'Legal Calendar',
      icon: '📅',
      description: 'Track important dates',
      action: () => alert('Legal Calendar - Coming Soon!')
    },
    {
      id: 'report-generator',
      label: 'Report Generator',
      icon: '📊',
      description: 'Generate case reports',
      action: () => alert('Report Generator - Coming Soon!')
    }
  ];

  const aiProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      icon: '🧠',
      status: 'online',
      model: 'GPT-4',
      usage: '75%'
    },
    {
      id: 'gemini',
      name: 'Gemini',
      icon: '💎',
      status: 'online',
      model: 'Pro',
      usage: '42%'
    },
    {
      id: 'groq',
      name: 'Groq',
      icon: '⚡',
      status: 'online',
      model: 'Llama 3',
      usage: '28%'
    }
  ];

  // Load sample data
  useEffect(() => {
    // Simulate loading recent cases and stats
    setTimeout(() => {
      setRecentCases([
        { id: 1, title: 'Smith vs. State Corp', type: 'Civil', status: 'Active' },
        { id: 2, title: 'Criminal Case #45', type: 'Criminal', status: 'Pending' },
        { id: 3, title: 'Planning Dispute', type: 'Administrative', status: 'Active' }
      ]);
      
      setQuickStats({
        totalCases: 24,
        pendingAnalyses: 3,
        aiCredits: 1250
      });
    }, 500);
  }, []);

  const handleNavigation = (itemId) => {
    onNavigate(itemId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">⚖️</span>
          {!isCollapsed && (
            <div className="brand-text">
              <span className="brand-name">Judiciary</span>
              <span className="brand-subtitle">Legal AI</span>
            </div>
          )}
        </div>
        
        <button 
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <span className={`toggle-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {isCollapsed ? '▶️' : '◀️'}
          </span>
        </button>
      </div>

      <div className="sidebar-content">
        {/* Main Navigation */}
        <div className="sidebar-section">
          {!isCollapsed && <h3 className="section-title">Navigation</h3>}
          
          <div className="nav-menu">
            {navItems.map(item => (
              <div 
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                onClick={() => handleNavigation(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                title={isCollapsed ? `${item.label} (${item.shortcut})` : ''}
              >
                <div className="nav-item-content">
                  <div className="nav-item-main">
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <div className="nav-text">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="nav-item-meta">
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                      {hoveredItem === item.id && (
                        <span className="nav-shortcut">{item.shortcut}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="nav-tooltip">
                    <div className="tooltip-content">
                      <div className="tooltip-title">{item.label}</div>
                      <div className="tooltip-description">{item.description}</div>
                      <div className="tooltip-shortcut">{item.shortcut}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="sidebar-section">
            <h3 className="section-title">Quick Stats</h3>
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-number">{quickStats.totalCases}</div>
                  <div className="stat-label">Total Cases</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-number">{quickStats.pendingAnalyses}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💳</div>
                <div className="stat-content">
                  <div className="stat-number">{quickStats.aiCredits}</div>
                  <div className="stat-label">AI Credits</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Providers Status */}
        <div className="sidebar-section">
          {!isCollapsed && <h3 className="section-title">AI Providers</h3>}
          
          <div className="ai-providers">
            {aiProviders.map(provider => (
              <div 
                key={provider.id}
                className={`ai-provider ${isCollapsed ? 'collapsed' : ''}`}
                title={isCollapsed ? `${provider.name} - ${provider.status}` : ''}
              >
                <div className="provider-main">
                  <div className="provider-icon">{provider.icon}</div>
                  {!isCollapsed && (
                    <div className="provider-info">
                      <div className="provider-name">{provider.name}</div>
                      <div className="provider-model">{provider.model}</div>
                    </div>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="provider-status">
                    <div className="status-indicator">
                      <div 
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(provider.status) }}
                      ></div>
                    </div>
                    <div className="usage-info">
                      <div className="usage-bar">
                        <div 
                          className="usage-fill"
                          style={{ width: provider.usage }}
                        ></div>
                      </div>
                      <span className="usage-text">{provider.usage}</span>
                    </div>
                  </div>
                )}

                {isCollapsed && (
                  <div 
                    className="provider-status-dot"
                    style={{ backgroundColor: getStatusColor(provider.status) }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legal Tools */}
        <div className="sidebar-section">
          {!isCollapsed && <h3 className="section-title">Legal Tools</h3>}
          
          <div className="tools-menu">
            {toolsItems.map(tool => (
              <div 
                key={tool.id}
                className={`tool-item ${isCollapsed ? 'collapsed' : ''}`}
                onClick={tool.action}
                title={isCollapsed ? tool.label : ''}
              >
                <div className="tool-icon">{tool.icon}</div>
                {!isCollapsed && (
                  <div className="tool-info">
                    <div className="tool-label">{tool.label}</div>
                    <div className="tool-description">{tool.description}</div>
                  </div>
                )}
                
                {isCollapsed && (
                  <div className="tool-tooltip">
                    <div className="tooltip-content">
                      <div className="tooltip-title">{tool.label}</div>
                      <div className="tooltip-description">{tool.description}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        {!isCollapsed && (
          <div className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">Recent Cases</h3>
              <button 
                className="section-action"
                onClick={() => onNavigate('cases')}
              >
                View All
              </button>
            </div>
            
            <div className="recent-cases">
              {recentCases.map(case_item => (
                <div 
                  key={case_item.id}
                  className="recent-case-item"
                  onClick={() => onNavigate('case-detail', case_item.id)}
                >
                  <div className="case-icon">📄</div>
                  <div className="case-info">
                    <div className="case-title">{case_item.title}</div>
                    <div className="case-meta">
                      <span className="case-type">{case_item.type}</span>
                      <span className={`case-status status-${case_item.status.toLowerCase()}`}>
                        {case_item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="footer-content">
            <div className="footer-user">
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <div className="user-name">Legal Analyst</div>
                <div className="user-role">Professional</div>
              </div>
            </div>
            
            <div className="footer-actions">
              <button 
                className="footer-action"
                onClick={() => alert('Settings')}
                title="Settings"
              >
                ⚙️
              </button>
              <button 
                className="footer-action"
                onClick={() => alert('Help')}
                title="Help"
              >
                ❓
              </button>
            </div>
          </div>
        ) : (
          <div className="footer-collapsed">
            <button 
              className="footer-action-collapsed"
              onClick={() => alert('User Menu')}
              title="User Menu"
            >
              👤
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;