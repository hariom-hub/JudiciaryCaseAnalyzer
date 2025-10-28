import React, { useState } from 'react';

import caseService from './services/caseService';
import './App.css';

// Import Analysis Components
import AnalysisForm from './components/Analysis/AnalysisForm';
import AnalysisHistory from './components/Analysis/AnalysisHistory';
import AnalysisResult from './components/Analysis/AnalysisResult';

// Import Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';

// Import Page Components
import Home from './pages/Home';
import Cases from './pages/Cases';
import CaseDetailPage from './pages/CaseDetailPage';

const App = () => {
  const [cases, setCases] = useState([]);
  const [currentCase, setCurrentCase] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Navigation handler
  const handleNavigate = (tab, caseId = null, options = {}) => {
    setActiveTab(tab);
    if (caseId) {
      setCurrentCase(caseId);
    }
    if (options.search) {
      console.log('Search query:', options.search);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Sample case data for demo
  const sampleCases = [
    {
      id: 1,
      title: "Smith vs. State Corporation",
      caseNumber: "CV-2023-001",
      caseType: "Civil",
      status: "Active",
      dateOfFiling: "2023-09-15",
      parties: {
        plaintiff: "John Smith",
        defendant: "State Corporation"
      }
    },
    {
      id: 2,
      title: "Criminal Case - Robbery",
      caseNumber: "CR-2023-045",
      caseType: "Criminal",
      status: "Pending",
      dateOfFiling: "2023-08-22",
      parties: {
        plaintiff: "State",
        defendant: "Mike Johnson"
      }
    }
  ];

  // Dashboard Component
  const Dashboard = () => (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Judiciary Case Analyzer</h1>
        <p>AI-powered legal case management and analysis system</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{sampleCases.length}</h3>
            <p>Total Cases</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <h3>{sampleCases.filter(c => c.status === 'Active').length}</h3>
            <p>Active Cases</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <div className="stat-content">
            <h3>3</h3>
            <p>AI Providers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>85%</h3>
            <p>Analysis Success</p>
          </div>
        </div>
      </div>

      <div className="recent-cases">
        <h2>Recent Cases</h2>
        <div className="case-list">
          {sampleCases.map(case_item => (
            <div key={case_item.id} className="case-card" onClick={() => setCurrentCase(case_item)}>
              <div className="case-header">
                <h3>{case_item.title}</h3>
                <span className={`status ${case_item.status.toLowerCase()}`}>
                  {case_item.status}
                </span>
              </div>
              <div className="case-details">
                <p><strong>Case #:</strong> {case_item.caseNumber}</p>
                <p><strong>Type:</strong> {case_item.caseType}</p>
                <p><strong>Filed:</strong> {new Date(case_item.dateOfFiling).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Cases List Component
  const CasesList = () => (
    <div className="cases-section">
      <div className="section-header">
        <h1>All Cases</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setActiveTab('add-case')}
        >
          Add New Case
        </button>
      </div>
      
      <div className="cases-grid">
        {sampleCases.map(case_item => (
          <div key={case_item.id} className="case-card detailed">
            <div className="case-header">
              <h3>{case_item.title}</h3>
              <span className={`status ${case_item.status.toLowerCase()}`}>
                {case_item.status}
              </span>
            </div>
            
            <div className="case-info">
              <div className="info-row">
                <span className="label">Case Number:</span>
                <span className="value">{case_item.caseNumber}</span>
              </div>
              <div className="info-row">
                <span className="label">Type:</span>
                <span className="value">{case_item.caseType}</span>
              </div>
              <div className="info-row">
                <span className="label">Plaintiff:</span>
                <span className="value">{case_item.parties.plaintiff}</span>
              </div>
              <div className="info-row">
                <span className="label">Defendant:</span>
                <span className="value">{case_item.parties.defendant}</span>
              </div>
              <div className="info-row">
                <span className="label">Filed:</span>
                <span className="value">{new Date(case_item.dateOfFiling).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="case-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setCurrentCase(case_item)}
              >
                View Details
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setCurrentCase(case_item);
                  setActiveTab('analysis');
                }}
              >
                Analyze
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // REFACTORED: AI Analysis Component using imported components
  const AIAnalysis = () => {
    const handleAnalyze = async (analysisConfig) => {
      if (!currentCase) {
        alert('Please select a case first');
        return;
      }

      setIsLoading(true);
      setAnalysisResult(null);

      // Simulate API call
      setTimeout(() => {
        const mockResults = {
          summary: `Case Summary for ${currentCase.title}:\n\nThis ${currentCase.caseType.toLowerCase()} case involves ${currentCase.parties.plaintiff} versus ${currentCase.parties.defendant}. Filed on ${new Date(currentCase.dateOfFiling).toLocaleDateString()}, this case presents several important legal considerations...\n\n[This is a mock analysis generated by ${analysisConfig.provider}]`,
          legal_issues: `Key Legal Issues in ${currentCase.title}:\n\n1. Jurisdictional Questions\n2. Statute of Limitations\n3. Evidence Admissibility\n4. Constitutional Considerations\n\n[Mock analysis]`,
          precedents: `Relevant Precedents for ${currentCase.title}:\n\n1. Similar Case vs. State (2020)\n2. Landmark Decision ABC (2018)\n3. Circuit Court Ruling XYZ (2019)\n\n[Mock precedent analysis]`,
          outcome_prediction: `Outcome Prediction for ${currentCase.title}:\n\nBased on similar cases and legal precedents:\n- 65% likelihood of favorable outcome for plaintiff\n- 35% likelihood of favorable outcome for defendant\n- Estimated timeline: 6-12 months\n\n[Mock prediction]`,
          strengths_weaknesses: `Strengths & Weaknesses Analysis for ${currentCase.title}:\n\nPlaintiff Strengths:\n- Strong factual foundation\n- Clear legal precedent\n\nDefendant Strengths:\n- Procedural defenses available\n- Statute of limitations questions\n\n[Mock analysis]`,
          custom: analysisConfig.prompt
        };

        const result = {
          id: Date.now(),
          content: mockResults[analysisConfig.analysisType] || mockResults.summary,
          provider: analysisConfig.provider,
          providerName: analysisConfig.provider === 'openai' ? 'OpenAI GPT' : 
                        analysisConfig.provider === 'gemini' ? 'Google Gemini' : 'Groq',
          model: 'GPT-4',
          analysisType: analysisConfig.analysisType,
          timestamp: new Date().toISOString(),
          duration: '45s',
          tokensUsed: 2456,
          prompt: analysisConfig.prompt,
          caseInfo: {
            title: currentCase.title,
            caseNumber: currentCase.caseNumber,
            caseType: currentCase.caseType
          }
        };

        setAnalysisResult(result);
        setIsLoading(false);
      }, 3000);
    };

    const handleSelectHistoryAnalysis = (analysis) => {
      // Convert history item to result format and display it
      setAnalysisResult({
        ...analysis,
        content: `[Historical Analysis Result]\n\n${analysis.result}`,
        caseInfo: {
          title: analysis.caseTitle,
          caseNumber: analysis.caseNumber,
          caseType: 'Civil'
        }
      });
    };

    return (
      <div className="analysis-section">
        <h1>AI Legal Analysis</h1>
        
        {!currentCase ? (
          <div className="no-case-selected">
            <h3>No Case Selected</h3>
            <p>Please select a case from the Cases section to perform AI analysis.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('cases')}
            >
              Browse Cases
            </button>
          </div>
        ) : (
          <>
            {/* Analysis Form */}
            <AnalysisForm 
              selectedCase={currentCase}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />

            {/* Analysis Result */}
            {analysisResult && (
              <AnalysisResult 
                result={analysisResult}
                onClose={() => setAnalysisResult(null)}
              />
            )}

            {/* Analysis History */}
            <AnalysisHistory 
              onSelectAnalysis={handleSelectHistoryAnalysis}
              onNavigate={handleNavigate}
            />
          </>
        )}
      </div>
    );
  };

  // Add Case Component (unchanged)
  const AddCase = () => {
    const [formData, setFormData] = useState({
      title: '',
      caseNumber: '',
      caseType: 'Civil',
      court: '',
      plaintiff: '',
      defendant: '',
      dateOfFiling: '',
      caseText: ''
    });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [extractedText, setExtractedText] = useState('');

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload only PDF, DOCX, DOC, or TXT files');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setUploadedFile(file);
      setIsProcessingFile(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockText = `[Extracted from ${file.name}]

CASE DOCUMENT CONTENT:

This is a sample extracted text from the uploaded document. In a real implementation, this would contain the actual text extracted from your PDF or DOCX file using libraries like:

- PDF: pdf-parse, pdfjs-dist
- DOCX: mammoth.js, docx-preview
- DOC: textract, mammoth.js

The extracted content would include:
1. All readable text from the document
2. Proper formatting preservation
3. Structured content extraction
4. Metadata if available

File Details:
- Name: ${file.name}
- Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- Type: ${file.type}
- Last Modified: ${new Date(file.lastModified).toLocaleString()}

This extracted text can now be used as the case text for AI analysis.`;

        setExtractedText(mockText);
        setFormData(prev => ({
          ...prev,
          caseText: mockText
        }));

      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please try again.');
      } finally {
        setIsProcessingFile(false);
      }
    };

    const removeFile = () => {
      setUploadedFile(null);
      setExtractedText('');
      setFormData(prev => ({
        ...prev,
        caseText: ''
      }));
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setIsLoading(true);
    
    const caseData = {
      title: formData.title.trim(),
      caseType: formData.caseType.toLowerCase(),
      caseText: formData.caseText.trim(),
      caseNumber: formData.caseNumber.trim() || `CV-${Date.now()}`,
      court: formData.court.trim() || 'Not specified',
      status: 'pending',
      plaintiffs: formData.plaintiff ? [formData.plaintiff.trim()] : [],
      defendants: formData.defendant ? [formData.defendant.trim()] : [],
      filingDate: formData.dateOfFiling || new Date().toISOString().split('T')[0]
    };

    console.log('📤 Sending:', caseData);

    // Direct axios call to test
    const response = await fetch('http://localhost:5000/api/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData)
    });

    const result = await response.json();
    console.log('📥 Response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create case');
    }

    alert('✅ Case added successfully!');
    
    setFormData({
      title: '', caseNumber: '', caseType: 'Civil',
      court: '', plaintiff: '', defendant: '',
      dateOfFiling: '', caseText: ''
    });
    
    setActiveTab('cases');
    
  } catch (error) {
    console.error('❌ Full error:', error);
    alert('Error: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};

    return (
      <div className="add-case-section">
        <h1>Add New Case</h1>
        
        <form onSubmit={handleSubmit} className="case-form">
          <div className="form-row">
            <div className="form-group">
              <label>Case Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter case title"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Case Number</label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleInputChange}
                placeholder="e.g., CV-2023-001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Case Type *</label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleInputChange}
                required
              >
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Constitutional">Constitutional</option>
                <option value="Administrative">Administrative</option>
                <option value="Family">Family</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Court</label>
              <input
                type="text"
                name="court"
                value={formData.court}
                onChange={handleInputChange}
                placeholder="e.g., Supreme Court, High Court"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Plaintiff</label>
              <input
                type="text"
                name="plaintiff"
                value={formData.plaintiff}
                onChange={handleInputChange}
                placeholder="Plaintiff name"
              />
            </div>
            
            <div className="form-group">
              <label>Defendant</label>
              <input
                type="text"
                name="defendant"
                value={formData.defendant}
                onChange={handleInputChange}
                placeholder="Defendant name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date of Filing</label>
            <input
              type="date"
              name="dateOfFiling"
              value={formData.dateOfFiling}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Case Text *</label>
            
            <div className="file-upload-section">
              <div className="upload-options">
                <div className="upload-option">
                  <input
                    type="file"
                    id="document-upload"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                  <label htmlFor="document-upload" className="file-upload-label">
                    <span className="upload-icon">📄</span>
                    <div className="upload-text">
                      <strong>Upload Document</strong>
                      <span>PDF, DOCX, DOC, or TXT files (max 10MB)</span>
                    </div>
                  </label>
                </div>
                
                <div className="upload-divider">
                  <span>OR</span>
                </div>
                
                <div className="manual-input-label">
                  <span>📝 Type manually below</span>
                </div>
              </div>

              {isProcessingFile && (
                <div className="file-processing">
                  <div className="processing-spinner"></div>
                  <span>Processing document...</span>
                </div>
              )}

              {uploadedFile && !isProcessingFile && (
                <div className="uploaded-file">
                  <div className="file-info">
                    <div className="file-icon">
                      {uploadedFile.type.includes('pdf') ? '📕' : 
                       uploadedFile.type.includes('word') ? '📘' : '📄'}
                    </div>
                    <div className="file-details">
                      <div className="file-name">{uploadedFile.name}</div>
                      <div className="file-size">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="remove-file-btn"
                      onClick={removeFile}
                      title="Remove file"
                    >
                      ❌
                    </button>
                  </div>
                  <div className="extraction-status">
                    ✅ Text extracted successfully
                  </div>
                </div>
              )}
            </div>

            <textarea
              name="caseText"
              value={formData.caseText}
              onChange={handleInputChange}
              placeholder={uploadedFile ? "Text extracted from uploaded document (you can edit if needed)" : "Enter the full case details, facts, and relevant information..."}
              rows={12}
              required
              className={uploadedFile ? "has-extracted-content" : ""}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setActiveTab('cases')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Case
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render current page based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Home onNavigate={handleNavigate} />;
      case 'cases':
        return <Cases onNavigate={handleNavigate} />;
      case 'case-detail':
        return <CaseDetailPage caseId={currentCase} onNavigate={handleNavigate} />;
      case 'analysis':
        return <AIAnalysis />;
      case 'add-case':
        return <AddCase />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Header 
        currentUser="Legal Analyst"
        onNavigate={handleNavigate}
        activeTab={activeTab}
      />

      <div className="app-body">
        <Sidebar 
          activeTab={activeTab}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {renderContent()}
        </main>
      </div>

      <Footer onNavigate={handleNavigate} />

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing AI Analysis...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;