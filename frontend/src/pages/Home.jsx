import React, { useState, useEffect } from 'react';


const Home = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    completedAnalyses: 0,
    pendingCases: 0
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalCases: 24,
        activeCases: 12,
        completedAnalyses: 45,
        pendingCases: 8
      });

      setRecentCases([
        {
          id: 1,
          title: "Smith vs. State Corporation",
          caseNumber: "CV-2023-001",
          caseType: "Civil",
          status: "Active",
          dateOfFiling: "2023-09-15",
          lastUpdated: "2023-09-23"
        },
        {
          id: 2,
          title: "Criminal Case - Robbery Investigation",
          caseNumber: "CR-2023-045",
          caseType: "Criminal",
          status: "Pending",
          dateOfFiling: "2023-09-10",
          lastUpdated: "2023-09-22"
        },
        {
          id: 3,
          title: "Johnson vs. City Planning Department",
          caseNumber: "AD-2023-012",
          caseType: "Administrative",
          status: "Active",
          dateOfFiling: "2023-09-08",
          lastUpdated: "2023-09-21"
        }
      ]);

      setRecentAnalyses([
        {
          id: 1,
          caseTitle: "Smith vs. State Corporation",
          analysisType: "Legal Issues",
          aiProvider: "OpenAI",
          status: "Completed",
          createdAt: "2023-09-23 10:30 AM"
        },
        {
          id: 2,
          caseTitle: "Criminal Case - Robbery Investigation",
          analysisType: "Case Summary",
          aiProvider: "Groq",
          status: "Completed",
          createdAt: "2023-09-23 09:15 AM"
        },
        {
          id: 3,
          caseTitle: "Johnson vs. City Planning Department",
          analysisType: "Precedent Analysis",
          aiProvider: "Gemini",
          status: "Processing",
          createdAt: "2023-09-23 08:45 AM"
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ icon, title, value, subtitle, trend, color = "blue" }) => (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">
        <span>{icon}</span>
      </div>
      <div className="stat-content">
        <div className="stat-header">
          <h3>{value}</h3>
          {trend && (
            <div className={`trend ${trend.type}`}>
              <span className="trend-icon">{trend.type === 'up' ? '📈' : '📉'}</span>
              <span className="trend-value">{trend.value}%</span>
            </div>
          )}
        </div>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickActionCard = ({ icon, title, description, action, color }) => (
    <div className={`quick-action-card quick-action-${color}`} onClick={action}>
      <div className="action-icon">
        <span>{icon}</span>
      </div>
      <div className="action-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="action-arrow">→</div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Judiciary Case Analyzer</h1>
          <p>AI-powered legal case management and analysis platform</p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => onNavigate('add-case')}
            >
              <span>➕</span> Add New Case
            </button>
            <button 
              className="btn btn-outline btn-large"
              onClick={() => onNavigate('cases')}
            >
              <span>📋</span> Browse Cases
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-card">
            <div className="card-header">
              <div className="card-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <div className="card-content">
              <div className="mock-text-line long"></div>
              <div className="mock-text-line medium"></div>
              <div className="mock-text-line short"></div>
              <div className="mock-ai-badge">🤖 AI Analysis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Dashboard Overview</h2>
          <div className="section-meta">
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="stats-grid">
          <StatCard
            icon="📋"
            title="Total Cases"
            value={stats.totalCases}
            subtitle="All time"
            trend={{ type: 'up', value: 12 }}
            color="blue"
          />
          <StatCard
            icon="⚖️"
            title="Active Cases"
            value={stats.activeCases}
            subtitle="Currently in progress"
            trend={{ type: 'up', value: 8 }}
            color="green"
          />
          <StatCard
            icon="🤖"
            title="AI Analyses"
            value={stats.completedAnalyses}
            subtitle="Completed this month"
            trend={{ type: 'up', value: 15 }}
            color="purple"
          />
          <StatCard
            icon="⏳"
            title="Pending Review"
            value={stats.pendingCases}
            subtitle="Awaiting action"
            trend={{ type: 'down', value: 5 }}
            color="orange"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        
        <div className="quick-actions-grid">
          <QuickActionCard
            icon="➕"
            title="Add New Case"
            description="Create and upload a new legal case for analysis"
            action={() => onNavigate('add-case')}
            color="blue"
          />
          <QuickActionCard
            icon="🔍"
            title="Search Cases"
            description="Find and filter through your case database"
            action={() => onNavigate('cases')}
            color="green"
          />
          <QuickActionCard
            icon="🤖"
            title="AI Analysis"
            description="Run intelligent analysis on your cases"
            action={() => onNavigate('analysis')}
            color="purple"
          />
          <QuickActionCard
            icon="📊"
            title="Reports"
            description="Generate comprehensive case reports"
            action={() => alert('Reports feature coming soon!')}
            color="orange"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Cases</h2>
            <button 
              className="btn btn-outline btn-small"
              onClick={() => onNavigate('cases')}
            >
              View All
            </button>
          </div>
          
          <div className="recent-items">
            {recentCases.map(case_item => (
              <div key={case_item.id} className="recent-item" onClick={() => onNavigate('case-detail', case_item.id)}>
                <div className="item-icon">
                  <span>📄</span>
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <h4>{case_item.title}</h4>
                    <span className={`status ${case_item.status.toLowerCase()}`}>
                      {case_item.status}
                    </span>
                  </div>
                  <div className="item-meta">
                    <span>Case #{case_item.caseNumber}</span>
                    <span>•</span>
                    <span>{case_item.caseType}</span>
                    <span>•</span>
                    <span>Updated {new Date(case_item.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="item-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent AI Analyses</h2>
            <button 
              className="btn btn-outline btn-small"
              onClick={() => onNavigate('analysis')}
            >
              View All
            </button>
          </div>
          
          <div className="recent-items">
            {recentAnalyses.map(analysis => (
              <div key={analysis.id} className="recent-item">
                <div className="item-icon">
                  <span>🤖</span>
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <h4>{analysis.analysisType}</h4>
                    <span className={`status ${analysis.status.toLowerCase()}`}>
                      {analysis.status}
                    </span>
                  </div>
                  <div className="item-meta">
                    <span>{analysis.caseTitle}</span>
                    <span>•</span>
                    <span>{analysis.aiProvider}</span>
                    <span>•</span>
                    <span>{analysis.createdAt}</span>
                  </div>
                </div>
                <div className="item-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Providers Status */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>AI Providers Status</h2>
        </div>
        
        <div className="providers-status">
          <div className="provider-status">
            <div className="provider-info">
              <span className="provider-icon">🧠</span>
              <div className="provider-details">
                <h4>OpenAI GPT</h4>
                <p>GPT-3.5 Turbo & GPT-4</p>
              </div>
            </div>
            <div className="provider-status-indicator online">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
          
          <div className="provider-status">
            <div className="provider-info">
              <span className="provider-icon">💎</span>
              <div className="provider-details">
                <h4>Google Gemini</h4>
                <p>Gemini Pro</p>
              </div>
            </div>
            <div className="provider-status-indicator online">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
          
          <div className="provider-status">
            <div className="provider-info">
              <span className="provider-icon">⚡</span>
              <div className="provider-details">
                <h4>Groq</h4>
                <p>Llama 3 & Mixtral</p>
              </div>
            </div>
            <div className="provider-status-indicator online">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;