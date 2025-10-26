import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

const Header = ({ currentUser = "Legal Analyst", onNavigate, activeTab }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'analysis',
      title: 'AI Analysis Completed',
      message: 'Case summary for "Smith vs. State Corp" is ready',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'case',
      title: 'New Case Added',
      message: 'Criminal case CR-2023-089 has been added',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'New AI models are now available',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Hearing Reminder',
      message: 'Court hearing scheduled for tomorrow',
      time: '1 day ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('cases', null, { search: searchQuery });
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read and navigate based on type
    switch (notification.type) {
      case 'analysis':
        onNavigate('analysis');
        break;
      case 'case':
        onNavigate('cases');
        break;
      default:
        break;
    }
    setIsNotificationsOpen(false);
  };

  const getBreadcrumb = () => {
    const breadcrumbs = {
      'dashboard': 'Dashboard',
      'cases': 'Legal Cases',
      'case-detail': 'Case Details',
      'analysis': 'AI Analysis',
      'add-case': 'Add New Case'
    };
    return breadcrumbs[activeTab] || 'Dashboard';
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'analysis': '🤖',
      'case': '📋',
      'system': '⚙️',
      'reminder': '⏰'
    };
    return icons[type] || '📢';
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="header-left">
          <div className="logo" onClick={() => onNavigate('dashboard')}>
            <span className="logo-icon">⚖️</span>
            <div className="logo-text">
              <span className="logo-main">Judiciary Analyzer</span>
              <span className="logo-sub">AI-Powered Legal Platform</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="header-center">
          <form onSubmit={handleSearch} className="search-container">
            <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search cases, documents, or analyses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Search Suggestions (shown when focused) */}
            {isSearchFocused && searchQuery && (
              <div className="search-suggestions">
                <div className="suggestion-section">
                  <h4>Recent Searches</h4>
                  <div className="suggestion-item" onClick={() => setSearchQuery('contract dispute')}>
                    <span className="suggestion-icon">🔍</span>
                    <span>contract dispute</span>
                  </div>
                  <div className="suggestion-item" onClick={() => setSearchQuery('criminal case')}>
                    <span className="suggestion-icon">🔍</span>
                    <span>criminal case</span>
                  </div>
                </div>
                <div className="suggestion-section">
                  <h4>Quick Actions</h4>
                  <div className="suggestion-item" onClick={() => onNavigate('add-case')}>
                    <span className="suggestion-icon">➕</span>
                    <span>Add New Case</span>
                  </div>
                  <div className="suggestion-item" onClick={() => onNavigate('analysis')}>
                    <span className="suggestion-icon">🤖</span>
                    <span>Run AI Analysis</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Side - Actions and Profile */}
        <div className="header-right">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="quick-action-btn"
              onClick={() => onNavigate('add-case')}
              title="Add New Case"
            >
              <span className="action-icon">➕</span>
              <span className="action-label">Add Case</span>
            </button>
            
            <button 
              className="quick-action-btn"
              onClick={() => onNavigate('analysis')}
              title="AI Analysis"
            >
              <span className="action-icon">🤖</span>
              <span className="action-label">Analyze</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="notifications-container" ref={notificationsRef}>
            <button 
              className={`notifications-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              title="Notifications"
            >
              <span className="notifications-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notifications-badge">{unreadCount}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read">Mark all read</button>
                </div>
                
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                      {notification.unread && (
                        <div className="unread-indicator"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="notifications-footer">
                  <button className="view-all-notifications">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="profile-container" ref={profileRef}>
            <button 
              className="profile-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="profile-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="profile-info">
                <span className="profile-name">{currentUser}</span>
                <span className="profile-role">Legal Professional</span>
              </div>
              <span className={`profile-arrow ${isProfileOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-avatar-large">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <div className="profile-details">
                    <div className="profile-name-large">{currentUser}</div>
                    <div className="profile-email">legal.analyst@lawfirm.com</div>
                  </div>
                </div>

                <div className="profile-menu">
                  <button className="profile-menu-item">
                    <span className="menu-icon">👤</span>
                    <span>Profile Settings</span>
                  </button>
                  <button className="profile-menu-item">
                    <span className="menu-icon">⚙️</span>
                    <span>Preferences</span>
                  </button>
                  <button className="profile-menu-item">
                    <span className="menu-icon">🔑</span>
                    <span>API Keys</span>
                  </button>
                  <button className="profile-menu-item">
                    <span className="menu-icon">📊</span>
                    <span>Usage Statistics</span>
                  </button>
                  <button className="profile-menu-item">
                    <span className="menu-icon">❓</span>
                    <span>Help & Support</span>
                  </button>
                  
                  <div className="menu-divider"></div>
                  
                  <button className="profile-menu-item logout">
                    <span className="menu-icon">🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="profile-dropdown-footer">
                  <div className="app-version">Version 1.0.0</div>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button 
            className="settings-btn"
            title="Settings"
            onClick={() => alert('Settings panel coming soon!')}
          >
            <span className="settings-icon">⚙️</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Toggle (hidden on desktop) */}
      <button className="mobile-menu-toggle">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
    </header>
  );
};

export default Header;