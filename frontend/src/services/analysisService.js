// frontend/src/services/analysisService.js
import api from './api';

/**
 * Analysis Service
 * Handles all API calls related to case analysis
 */

const analysisService = {
  /**
   * Create a new analysis for a case
   * @param {Object} analysisData - Analysis request data
   * @param {string} analysisData.caseId - ID of the case to analyze
   * @param {string} analysisData.analysisType - Type of analysis (summary, legal_issues, precedents, prediction)
   * @param {string} analysisData.aiProvider - AI provider (openai or gemini)
   * @param {string} analysisData.apiKey - API key for the AI provider
   * @param {string} analysisData.model - Model to use (optional)
   * @returns {Promise} Analysis result
   */
  createAnalysis: async (analysisData) => {
    try {
      const response = await api.post('/analysis', analysisData);
      return response.data;
    } catch (error) {
      console.error('Error creating analysis:', error);
      throw error.response?.data || { message: 'Failed to create analysis' };
    }
  },

  /**
   * Get all analyses for a specific case
   * @param {string} caseId - ID of the case
   * @returns {Promise} Array of analyses
   */
  getAnalysesByCase: async (caseId) => {
    try {
      const response = await api.get(`/analysis/case/${caseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error.response?.data || { message: 'Failed to fetch analyses' };
    }
  },

  /**
   * Get a single analysis by ID
   * @param {string} analysisId - ID of the analysis
   * @returns {Promise} Analysis object
   */
  getAnalysisById: async (analysisId) => {
    try {
      const response = await api.get(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error.response?.data || { message: 'Failed to fetch analysis' };
    }
  },

  /**
   * Delete an analysis
   * @param {string} analysisId - ID of the analysis to delete
   * @returns {Promise} Success message
   */
  deleteAnalysis: async (analysisId) => {
    try {
      const response = await api.delete(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error.response?.data || { message: 'Failed to delete analysis' };
    }
  },

  /**
   * Perform batch analysis (multiple types at once)
   * @param {Object} batchData - Batch analysis request
   * @param {string} batchData.caseId - ID of the case
   * @param {Array} batchData.analysisTypes - Array of analysis types
   * @param {string} batchData.aiProvider - AI provider
   * @param {string} batchData.apiKey - API key
   * @returns {Promise} Array of analysis results
   */
  performBatchAnalysis: async (batchData) => {
    try {
      const { caseId, analysisTypes, aiProvider, apiKey, model } = batchData;
      
      // Create promises for all analysis types
      const analysisPromises = analysisTypes.map(type =>
        analysisService.createAnalysis({
          caseId,
          analysisType: type,
          aiProvider,
          apiKey,
          model
        })
      );

      // Execute all analyses in parallel
      const results = await Promise.allSettled(analysisPromises);
      
      // Process results
      return results.map((result, index) => ({
        type: analysisTypes[index],
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    } catch (error) {
      console.error('Error performing batch analysis:', error);
      throw error;
    }
  },

  /**
   * Get analysis statistics for a case
   * @param {string} caseId - ID of the case
   * @returns {Promise} Statistics object
   */
  getAnalysisStats: async (caseId) => {
    try {
      const analyses = await analysisService.getAnalysesByCase(caseId);
      
      return {
        total: analyses.length,
        byType: analyses.reduce((acc, analysis) => {
          acc[analysis.analysisType] = (acc[analysis.analysisType] || 0) + 1;
          return acc;
        }, {}),
        byProvider: analyses.reduce((acc, analysis) => {
          acc[analysis.aiProvider] = (acc[analysis.aiProvider] || 0) + 1;
          return acc;
        }, {}),
        latest: analyses[0] || null
      };
    } catch (error) {
      console.error('Error fetching analysis stats:', error);
      throw error;
    }
  },

  /**
   * Validate AI provider credentials
   * @param {string} provider - AI provider (openai or gemini)
   * @param {string} apiKey - API key to validate
   * @returns {Promise} Validation result
   */
  validateCredentials: async (provider, apiKey) => {
    try {
      const response = await api.post('/analysis/validate', {
        aiProvider: provider,
        apiKey
      });
      return response.data;
    } catch (error) {
      console.error('Error validating credentials:', error);
      return { valid: false, message: error.response?.data?.message || 'Invalid credentials' };
    }
  },

  /**
   * Get available AI models for a provider
   * @param {string} provider - AI provider (openai or gemini)
   * @returns {Array} Available models
   */
  getAvailableModels: (provider) => {
    const models = {
      openai: [
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast & Cost-effective)' },
        { value: 'gpt-4', label: 'GPT-4 (Most Capable)' },
        { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo (Latest)' }
      ],
      gemini: [
        { value: 'gemini-pro', label: 'Gemini Pro (Balanced)' },
        { value: 'gemini-pro-vision', label: 'Gemini Pro Vision (Multimodal)' }
      ]
    };
    
    return models[provider] || [];
  },

  /**
   * Get analysis type descriptions
   * @returns {Object} Analysis type descriptions
   */
  getAnalysisTypes: () => {
    return {
      summary: {
        label: 'Case Summary',
        description: 'Generate a comprehensive summary of the case facts, parties involved, and key events',
        icon: '📋'
      },
      legal_issues: {
        label: 'Legal Issues',
        description: 'Identify and analyze the key legal questions and issues in the case',
        icon: '⚖️'
      },
      precedents: {
        label: 'Relevant Precedents',
        description: 'Find similar cases and relevant legal precedents that may apply',
        icon: '📚'
      },
      prediction: {
        label: 'Outcome Prediction',
        description: 'Analyze potential outcomes and provide predictions based on case details',
        icon: '🔮'
      }
    };
  },

  /**
   * Format analysis result for display
   * @param {Object} analysis - Raw analysis object
   * @returns {Object} Formatted analysis
   */
  formatAnalysisResult: (analysis) => {
    return {
      id: analysis._id,
      type: analysis.analysisType,
      result: analysis.result,
      provider: analysis.aiProvider,
      model: analysis.model || 'default',
      timestamp: new Date(analysis.createdAt).toLocaleString(),
      executionTime: analysis.executionTime || 'N/A'
    };
  },

  /**
   * Export analysis to different formats
   * @param {Object} analysis - Analysis object
   * @param {string} format - Export format (json, txt, pdf)
   * @returns {Promise} Exported data
   */
  exportAnalysis: async (analysis, format = 'json') => {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(analysis, null, 2);
        
        case 'txt':
          return `
CASE ANALYSIS REPORT
====================

Analysis Type: ${analysis.analysisType}
AI Provider: ${analysis.aiProvider}
Date: ${new Date(analysis.createdAt).toLocaleString()}

RESULT:
-------
${analysis.result}
          `.trim();
        
        case 'pdf':
          // This would require a PDF library in production
          throw new Error('PDF export not yet implemented');
        
        default:
          throw new Error('Unsupported format');
      }
    } catch (error) {
      console.error('Error exporting analysis:', error);
      throw error;
    }
  }
};

export default analysisService;