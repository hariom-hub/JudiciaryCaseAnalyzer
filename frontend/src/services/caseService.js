// frontend/src/services/caseService.js
import api from './api';

/**
 * Case Service
 * Handles all API calls related to legal case management
 */

const caseService = {
  /**
   * Get all cases with optional filtering and sorting
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term
   * @param {string} params.caseType - Filter by case type
   * @param {string} params.status - Filter by status
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Array of cases
   */
  getAllCases: async (params = {}) => {
    try {
      const response = await api.get('/cases', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error.response?.data || { message: 'Failed to fetch cases' };
    }
  },

  /**
   * Get a single case by ID
   * @param {string} caseId - ID of the case
   * @returns {Promise} Case object
   */
  getCaseById: async (caseId) => {
    try {
      const response = await api.get(`/cases/${caseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching case:', error);
      throw error.response?.data || { message: 'Failed to fetch case' };
    }
  },

  /**
   * Create a new case
   * @param {Object} caseData - Case information
   * @param {string} caseData.title - Case title
   * @param {string} caseData.caseNumber - Unique case number
   * @param {string} caseData.caseType - Type of case (civil, criminal, etc.)
   * @param {string} caseData.court - Court name
   * @param {string} caseData.judge - Judge name
   * @param {Array} caseData.plaintiffs - Array of plaintiff names
   * @param {Array} caseData.defendants - Array of defendant names
   * @param {string} caseData.filingDate - Filing date
   * @param {string} caseData.status - Case status
   * @param {string} caseData.description - Case description
   * @param {string} caseData.caseText - Full case text/details
   * @returns {Promise} Created case object
   */
  createCase: async (caseData) => {
    try {
      const response = await api.post('/cases', caseData);
      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error.response?.data || { message: 'Failed to create case' };
    }
  },

  /**
   * Update an existing case
   * @param {string} caseId - ID of the case to update
   * @param {Object} caseData - Updated case information
   * @returns {Promise} Updated case object
   */
  updateCase: async (caseId, caseData) => {
    try {
      const response = await api.put(`/cases/${caseId}`, caseData);
      return response.data;
    } catch (error) {
      console.error('Error updating case:', error);
      throw error.response?.data || { message: 'Failed to update case' };
    }
  },

  /**
   * Delete a case
   * @param {string} caseId - ID of the case to delete
   * @returns {Promise} Success message
   */
  deleteCase: async (caseId) => {
    try {
      const response = await api.delete(`/cases/${caseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error.response?.data || { message: 'Failed to delete case' };
    }
  },

  /**
   * Search cases by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise} Array of matching cases
   */
  searchCases: async (keyword) => {
    try {
      const response = await api.get('/cases/search', {
        params: { q: keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching cases:', error);
      throw error.response?.data || { message: 'Failed to search cases' };
    }
  },

  /**
   * Get cases by type
   * @param {string} caseType - Type of case (civil, criminal, family, etc.)
   * @returns {Promise} Array of cases
   */
  getCasesByType: async (caseType) => {
    try {
      const response = await api.get('/cases', {
        params: { caseType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cases by type:', error);
      throw error.response?.data || { message: 'Failed to fetch cases by type' };
    }
  },

  /**
   * Get cases by status
   * @param {string} status - Case status (pending, active, closed, etc.)
   * @returns {Promise} Array of cases
   */
  getCasesByStatus: async (status) => {
    try {
      const response = await api.get('/cases', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cases by status:', error);
      throw error.response?.data || { message: 'Failed to fetch cases by status' };
    }
  },

  /**
   * Get case statistics
   * @returns {Promise} Statistics object
   */
  getCaseStatistics: async () => {
    try {
      const cases = await caseService.getAllCases();
      
      return {
        total: cases.length,
        byType: cases.reduce((acc, c) => {
          acc[c.caseType] = (acc[c.caseType] || 0) + 1;
          return acc;
        }, {}),
        byStatus: cases.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {}),
        recent: cases.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching case statistics:', error);
      throw error;
    }
  },

  /**
   * Get available case types
   * @returns {Array} Case type options
   */
  getCaseTypes: () => {
    return [
      { value: 'civil', label: 'Civil Case', icon: '⚖️' },
      { value: 'criminal', label: 'Criminal Case', icon: '🔨' },
      { value: 'family', label: 'Family Law', icon: '👨‍👩‍👧' },
      { value: 'corporate', label: 'Corporate/Business', icon: '🏢' },
      { value: 'constitutional', label: 'Constitutional', icon: '📜' },
      { value: 'labor', label: 'Labor/Employment', icon: '👷' },
      { value: 'property', label: 'Property/Real Estate', icon: '🏠' },
      { value: 'intellectual', label: 'Intellectual Property', icon: '💡' },
      { value: 'tax', label: 'Tax Law', icon: '💰' },
      { value: 'immigration', label: 'Immigration', icon: '🛂' },
      { value: 'environmental', label: 'Environmental', icon: '🌍' },
      { value: 'other', label: 'Other', icon: '📋' }
    ];
  },

  /**
   * Get available case statuses
   * @returns {Array} Case status options
   */
  getCaseStatuses: () => {
    return [
      { value: 'pending', label: 'Pending', color: 'warning', icon: '⏳' },
      { value: 'active', label: 'Active', color: 'primary', icon: '🔄' },
      { value: 'under_review', label: 'Under Review', color: 'info', icon: '🔍' },
      { value: 'hearing', label: 'Hearing Scheduled', color: 'secondary', icon: '📅' },
      { value: 'judgment', label: 'Judgment Pending', color: 'dark', icon: '⚖️' },
      { value: 'closed', label: 'Closed', color: 'success', icon: '✅' },
      { value: 'dismissed', label: 'Dismissed', color: 'danger', icon: '❌' },
      { value: 'settled', label: 'Settled', color: 'success', icon: '🤝' },
      { value: 'appealed', label: 'Under Appeal', color: 'warning', icon: '📤' }
    ];
  },

  /**
   * Validate case data before submission
   * @param {Object} caseData - Case data to validate
   * @returns {Object} Validation result { valid: boolean, errors: array }
   */
  validateCaseData: (caseData) => {
    const errors = [];

    if (!caseData.title || caseData.title.trim().length < 5) {
      errors.push('Case title must be at least 5 characters long');
    }

    if (!caseData.caseNumber || caseData.caseNumber.trim().length < 3) {
      errors.push('Case number is required');
    }

    if (!caseData.caseType) {
      errors.push('Case type is required');
    }

    if (!caseData.court || caseData.court.trim().length < 3) {
      errors.push('Court name is required');
    }

    if (!caseData.plaintiffs || caseData.plaintiffs.length === 0) {
      errors.push('At least one plaintiff is required');
    }

    if (!caseData.defendants || caseData.defendants.length === 0) {
      errors.push('At least one defendant is required');
    }

    if (!caseData.filingDate) {
      errors.push('Filing date is required');
    }

    if (!caseData.status) {
      errors.push('Case status is required');
    }

    if (!caseData.caseText || caseData.caseText.trim().length < 50) {
      errors.push('Case details must be at least 50 characters long');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Format case data for display
   * @param {Object} caseData - Raw case object
   * @returns {Object} Formatted case object
   */
  formatCaseForDisplay: (caseData) => {
    return {
      ...caseData,
      filingDate: caseData.filingDate ? new Date(caseData.filingDate).toLocaleDateString() : 'N/A',
      createdAt: caseData.createdAt ? new Date(caseData.createdAt).toLocaleString() : 'N/A',
      updatedAt: caseData.updatedAt ? new Date(caseData.updatedAt).toLocaleString() : 'N/A',
      plaintiffsText: Array.isArray(caseData.plaintiffs) ? caseData.plaintiffs.join(', ') : caseData.plaintiffs,
      defendantsText: Array.isArray(caseData.defendants) ? caseData.defendants.join(', ') : caseData.defendants
    };
  },

  /**
   * Export case to different formats
   * @param {Object} caseData - Case object
   * @param {string} format - Export format (json, txt, csv)
   * @returns {string} Exported data
   */
  exportCase: (caseData, format = 'json') => {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(caseData, null, 2);
        
        case 'txt':
          return `
LEGAL CASE DETAILS
==================

Case Number: ${caseData.caseNumber}
Title: ${caseData.title}
Type: ${caseData.caseType}
Status: ${caseData.status}

Court: ${caseData.court}
Judge: ${caseData.judge || 'Not assigned'}
Filing Date: ${new Date(caseData.filingDate).toLocaleDateString()}

PARTIES:
--------
Plaintiffs: ${caseData.plaintiffs.join(', ')}
Defendants: ${caseData.defendants.join(', ')}

DESCRIPTION:
------------
${caseData.description || 'No description'}

CASE DETAILS:
-------------
${caseData.caseText}

Created: ${new Date(caseData.createdAt).toLocaleString()}
Last Updated: ${new Date(caseData.updatedAt).toLocaleString()}
          `.trim();
        
        case 'csv':
          return `Case Number,Title,Type,Status,Court,Judge,Filing Date,Plaintiffs,Defendants\n${caseData.caseNumber},"${caseData.title}",${caseData.caseType},${caseData.status},"${caseData.court}","${caseData.judge || ''}",${caseData.filingDate},"${caseData.plaintiffs.join('; ')}","${caseData.defendants.join('; ')}"`;
        
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting case:', error);
      throw error;
    }
  },

  /**
   * Duplicate a case (create a copy)
   * @param {string} caseId - ID of case to duplicate
   * @returns {Promise} New case object
   */
  duplicateCase: async (caseId) => {
    try {
      const originalCase = await caseService.getCaseById(caseId);
      
      // Remove ID and add "Copy" to title
      const { _id, createdAt, updatedAt, ...caseData } = originalCase;
      caseData.title = `${caseData.title} (Copy)`;
      caseData.caseNumber = `${caseData.caseNumber}-COPY`;
      
      return await caseService.createCase(caseData);
    } catch (error) {
      console.error('Error duplicating case:', error);
      throw error;
    }
  },

  /**
   * Batch delete cases
   * @param {Array} caseIds - Array of case IDs to delete
   * @returns {Promise} Deletion results
   */
  batchDeleteCases: async (caseIds) => {
    try {
      const deletePromises = caseIds.map(id => caseService.deleteCase(id));
      const results = await Promise.allSettled(deletePromises);
      
      return {
        successful: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        results
      };
    } catch (error) {
      console.error('Error batch deleting cases:', error);
      throw error;
    }
  }
};

export default caseService;