// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// API Endpoints
export const API_ENDPOINTS = {
  CASES: '/cases',
  ANALYSIS: '/analysis',
};

// Case Types
export const CASE_TYPES = [
  'Civil',
  'Criminal',
  'Constitutional',
  'Corporate',
  'Family',
  'Labor',
  'Tax',
  'Property',
  'Environmental',
  'Intellectual Property'
];

// Case Status
export const CASE_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
  APPEALED: 'Appealed'
};

// Analysis Types
export const ANALYSIS_TYPES = {
  SUMMARY: 'summary',
  LEGAL_ISSUES: 'legal_issues',
  PRECEDENTS: 'precedents',
  OUTCOME_PREDICTION: 'outcome_prediction'
};

// Analysis Type Labels (for display)
export const ANALYSIS_TYPE_LABELS = {
  [ANALYSIS_TYPES.SUMMARY]: 'Case Summary',
  [ANALYSIS_TYPES.LEGAL_ISSUES]: 'Legal Issues',
  [ANALYSIS_TYPES.PRECEDENTS]: 'Precedents & Case Law',
  [ANALYSIS_TYPES.OUTCOME_PREDICTION]: 'Outcome Prediction'
};

// AI Providers
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini'
};

// AI Provider Labels
export const AI_PROVIDER_LABELS = {
  [AI_PROVIDERS.OPENAI]: 'OpenAI GPT',
  [AI_PROVIDERS.GEMINI]: 'Google Gemini'
};

// OpenAI Models
export const OPENAI_MODELS = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
];

// Gemini Models
export const GEMINI_MODELS = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
];

// Alert/Message Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// UI Constants
export const UI_CONSTANTS = {
  MAX_TEXT_LENGTH: 10000,
  MIN_TEXT_LENGTH: 50,
  CARDS_PER_PAGE: 12,
  TRUNCATE_LENGTH: 150,
  DEBOUNCE_DELAY: 300
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (length) => `Minimum ${length} characters required`,
  MAX_LENGTH: (length) => `Maximum ${length} characters allowed`,
  INVALID_DATE: 'Please enter a valid date',
  CASE_TEXT_TOO_SHORT: `Case text must be at least ${UI_CONSTANTS.MIN_TEXT_LENGTH} characters`,
  CASE_TEXT_TOO_LONG: `Case text must not exceed ${UI_CONSTANTS.MAX_TEXT_LENGTH} characters`,
  API_KEY_REQUIRED: 'API key is required for AI analysis',
  SELECT_PROVIDER: 'Please select an AI provider',
  SELECT_MODEL: 'Please select a model'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CASE_CREATED: 'Case created successfully',
  CASE_UPDATED: 'Case updated successfully',
  CASE_DELETED: 'Case deleted successfully',
  ANALYSIS_COMPLETED: 'Analysis completed successfully',
  API_KEY_SAVED: 'API key saved successfully'
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  CASE_NOT_FOUND: 'Case not found',
  ANALYSIS_FAILED: 'Analysis failed. Please try again.',
  INVALID_API_KEY: 'Invalid API key. Please check and try again.',
  FETCH_CASES_FAILED: 'Failed to fetch cases',
  CREATE_CASE_FAILED: 'Failed to create case',
  DELETE_CASE_FAILED: 'Failed to delete case',
  API_RATE_LIMIT: 'API rate limit exceeded. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  OPENAI_API_KEY: 'judiciary_analyzer_openai_key',
  GEMINI_API_KEY: 'judiciary_analyzer_gemini_key',
  SELECTED_PROVIDER: 'judiciary_analyzer_provider',
  SELECTED_MODEL: 'judiciary_analyzer_model',
  USER_PREFERENCES: 'judiciary_analyzer_preferences'
};

// Routes
export const ROUTES = {
  HOME: '/',
  CASES: '/cases',
  CASE_DETAIL: '/cases/:id',
  ADD_CASE: '/add-case',
  ANALYSIS: '/analysis'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY',
  WITH_TIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DD'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Court Levels
export const COURT_LEVELS = [
  'Supreme Court',
  'High Court',
  'District Court',
  'Sessions Court',
  'Magistrate Court',
  'Tribunal'
];

// Case Priorities
export const CASE_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
};

// Analysis Status
export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Theme Colors (for consistency)
export const THEME_COLORS = {
  PRIMARY: '#0d6efd',
  SUCCESS: '#198754',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#0dcaf0',
  SECONDARY: '#6c757d'
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
  CASE_TYPES,
  CASE_STATUS,
  ANALYSIS_TYPES,
  ANALYSIS_TYPE_LABELS,
  AI_PROVIDERS,
  AI_PROVIDER_LABELS,
  OPENAI_MODELS,
  GEMINI_MODELS,
  ALERT_TYPES,
  UI_CONSTANTS,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  DATE_FORMATS,
  PAGINATION,
  COURT_LEVELS,
  CASE_PRIORITIES,
  ANALYSIS_STATUS,
  THEME_COLORS
};