import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import caseService from '../../services/caseService';
import { CASE_TYPES, CASE_STATUS, CASE_PRIORITIES, COURT_LEVELS } from '../../utils/constants';
import { validateCaseText, sanitizeText } from '../../utils/helpers';

const AddCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    caseType: '',
    status: 'Pending',
    priority: 'Medium',
    court: '',
    judge: '',
    jurisdiction: '',
    plaintiff: '',
    defendant: '',
    plaintiffLawyer: '',
    defendantLawyer: '',
    dateOfFiling: '',
    dateOfHearing: '',
    caseText: '',
    summary: '',
    tags: '',
    claimAmount: '',
    currency: 'USD'
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Case title is required');
      return;
    }

    if (!formData.caseType) {
      setError('Please select a case type');
      return;
    }

    if (!formData.caseText.trim()) {
      setError('Case description is required');
      return;
    }

    // Validate case text length
    const textValidation = validateCaseText(formData.caseText);
    if (!textValidation.valid) {
      setError(textValidation.message);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const caseData = {
        title: sanitizeText(formData.title),
        caseType: formData.caseType,
        caseText: sanitizeText(formData.caseText),
        status: formData.status,
        priority: formData.priority
      };

      // Add optional fields only if they have values
      if (formData.caseNumber.trim()) {
        caseData.caseNumber = sanitizeText(formData.caseNumber);
      }

      if (formData.court.trim()) {
        caseData.court = sanitizeText(formData.court);
      }

      if (formData.judge.trim()) {
        caseData.judge = sanitizeText(formData.judge);
      }

      if (formData.jurisdiction.trim()) {
        caseData.jurisdiction = sanitizeText(formData.jurisdiction);
      }

      // Add parties information
      if (formData.plaintiff.trim() || formData.defendant.trim()) {
        caseData.parties = {};
        if (formData.plaintiff.trim()) {
          caseData.parties.plaintiff = sanitizeText(formData.plaintiff);
        }
        if (formData.defendant.trim()) {
          caseData.parties.defendant = sanitizeText(formData.defendant);
        }
        if (formData.plaintiffLawyer.trim()) {
          caseData.parties.plaintiffLawyer = sanitizeText(formData.plaintiffLawyer);
        }
        if (formData.defendantLawyer.trim()) {
          caseData.parties.defendantLawyer = sanitizeText(formData.defendantLawyer);
        }
      }

      // Add dates
      if (formData.dateOfFiling) {
        caseData.dateOfFiling = formData.dateOfFiling;
      }

      if (formData.dateOfHearing) {
        caseData.dateOfHearing = formData.dateOfHearing;
      }

      // Add summary
      if (formData.summary.trim()) {
        caseData.summary = sanitizeText(formData.summary);
      }

      // Add tags (convert comma-separated string to array)
      if (formData.tags.trim()) {
        caseData.tags = formData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
      }

      // Add claim amount
      if (formData.claimAmount) {
        caseData.claimAmount = parseFloat(formData.claimAmount);
        caseData.currency = formData.currency;
      }

      console.log('Submitting case data:', caseData);

      // Call API to create case
      const response = await caseService.createCase(caseData);

      if (response.success) {
        setSuccess('Case created successfully!');
        
        // Reset form
        setFormData({
          title: '',
          caseNumber: '',
          caseType: '',
          status: 'Pending',
          priority: 'Medium',
          court: '',
          judge: '',
          jurisdiction: '',
          plaintiff: '',
          defendant: '',
          plaintiffLawyer: '',
          defendantLawyer: '',
          dateOfFiling: '',
          dateOfHearing: '',
          caseText: '',
          summary: '',
          tags: '',
          claimAmount: '',
          currency: 'USD'
        });

        // Redirect to cases list after 2 seconds
        setTimeout(() => {
          navigate('/cases');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating case:', err);
      setError(err.message || 'Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/cases');
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="bi bi-file-earmark-plus me-2"></i>
                Add New Case
                
              </h3>
            </div>

            <div className="card-body p-4">
              {/* Success Alert */}
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Basic Information
                  </h5>

                  <div className="row g-3">
                    {/* Case Title */}
                    <div className="col-md-8">
                      <label htmlFor="title" className="form-label">
                        Case Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter case title"
                        required
                      />
                    </div>

                    {/* Case Number */}
                    <div className="col-md-4">
                      <label htmlFor="caseNumber" className="form-label">
                        Case Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="caseNumber"
                        name="caseNumber"
                        value={formData.caseNumber}
                        onChange={handleChange}
                        placeholder="e.g., CIV-2025-001"
                      />
                      <small className="text-muted">Auto-generated if left empty</small>
                    </div>

                    {/* Case Type */}
                    <div className="col-md-4">
                      <label htmlFor="caseType" className="form-label">
                        Case Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="caseType"
                        name="caseType"
                        value={formData.caseType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        {CASE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-4">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        {Object.keys(CASE_STATUS).map(key => (
                          <option key={key} value={CASE_STATUS[key]}>
                            {CASE_STATUS[key]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div className="col-md-4">
                      <label htmlFor="priority" className="form-label">
                        Priority
                      </label>
                      <select
                        className="form-select"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        {Object.keys(CASE_PRIORITIES).map(key => (
                          <option key={key} value={CASE_PRIORITIES[key]}>
                            {CASE_PRIORITIES[key]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Court Information Section */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-building me-2"></i>
                    Court Information
                  </h5>

                  <div className="row g-3">
                    {/* Court */}
                    <div className="col-md-4">
                      <label htmlFor="court" className="form-label">Court</label>
                      <select
                        className="form-select"
                        id="court"
                        name="court"
                        value={formData.court}
                        onChange={handleChange}
                      >
                        <option value="">Select Court</option>
                        {COURT_LEVELS.map(court => (
                          <option key={court} value={court}>{court}</option>
                        ))}
                      </select>
                    </div>

                    {/* Judge */}
                    <div className="col-md-4">
                      <label htmlFor="judge" className="form-label">Judge</label>
                      <input
                        type="text"
                        className="form-control"
                        id="judge"
                        name="judge"
                        value={formData.judge}
                        onChange={handleChange}
                        placeholder="Judge name"
                      />
                    </div>

                    {/* Jurisdiction */}
                    <div className="col-md-4">
                      <label htmlFor="jurisdiction" className="form-label">Jurisdiction</label>
                      <input
                        type="text"
                        className="form-control"
                        id="jurisdiction"
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleChange}
                        placeholder="e.g., New Delhi"
                      />
                    </div>
                  </div>
                </div>

                {/* Parties Information Section */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-people me-2"></i>
                    Parties Information
                  </h5>

                  <div className="row g-3">
                    {/* Plaintiff */}
                    <div className="col-md-6">
                      <label htmlFor="plaintiff" className="form-label">Plaintiff</label>
                      <input
                        type="text"
                        className="form-control"
                        id="plaintiff"
                        name="plaintiff"
                        value={formData.plaintiff}
                        onChange={handleChange}
                        placeholder="Plaintiff name"
                      />
                    </div>

                    {/* Plaintiff Lawyer */}
                    <div className="col-md-6">
                      <label htmlFor="plaintiffLawyer" className="form-label">Plaintiff Lawyer</label>
                      <input
                        type="text"
                        className="form-control"
                        id="plaintiffLawyer"
                        name="plaintiffLawyer"
                        value={formData.plaintiffLawyer}
                        onChange={handleChange}
                        placeholder="Lawyer name"
                      />
                    </div>

                    {/* Defendant */}
                    <div className="col-md-6">
                      <label htmlFor="defendant" className="form-label">Defendant</label>
                      <input
                        type="text"
                        className="form-control"
                        id="defendant"
                        name="defendant"
                        value={formData.defendant}
                        onChange={handleChange}
                        placeholder="Defendant name"
                      />
                    </div>

                    {/* Defendant Lawyer */}
                    <div className="col-md-6">
                      <label htmlFor="defendantLawyer" className="form-label">Defendant Lawyer</label>
                      <input
                        type="text"
                        className="form-control"
                        id="defendantLawyer"
                        name="defendantLawyer"
                        value={formData.defendantLawyer}
                        onChange={handleChange}
                        placeholder="Lawyer name"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-calendar me-2"></i>
                    Important Dates
                  </h5>

                  <div className="row g-3">
                    {/* Date of Filing */}
                    <div className="col-md-6">
                      <label htmlFor="dateOfFiling" className="form-label">Date of Filing</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateOfFiling"
                        name="dateOfFiling"
                        value={formData.dateOfFiling}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Date of Hearing */}
                    <div className="col-md-6">
                      <label htmlFor="dateOfHearing" className="form-label">Next Hearing Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateOfHearing"
                        name="dateOfHearing"
                        value={formData.dateOfHearing}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-currency-dollar me-2"></i>
                    Financial Information
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label htmlFor="claimAmount" className="form-label">Claim Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        id="claimAmount"
                        name="claimAmount"
                        value={formData.claimAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="currency" className="form-label">Currency</label>
                      <select
                        className="form-select"
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Case Details Section */}
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="bi bi-file-text me-2"></i>
                    Case Details
                  </h5>

                  {/* Summary */}
                  <div className="mb-3">
                    <label htmlFor="summary" className="form-label">Brief Summary</label>
                    <textarea
                      className="form-control"
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Brief overview of the case..."
                      maxLength="2000"
                    />
                    <small className="text-muted">
                      {formData.summary.length}/2000 characters
                    </small>
                  </div>

                  {/* Case Text */}
                  <div className="mb-3">
                    <label htmlFor="caseText" className="form-label">
                      Full Case Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="caseText"
                      name="caseText"
                      value={formData.caseText}
                      onChange={handleChange}
                      rows="8"
                      placeholder="Detailed case information (minimum 50 characters)..."
                      required
                      minLength="50"
                      maxLength="50000"
                    />
                    <small className="text-muted">
                      {formData.caseText.length}/50000 characters (minimum 50 required)
                    </small>
                  </div>

                  {/* Tags */}
                  <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="contract, dispute, property (comma-separated)"
                    />
                    <small className="text-muted">Separate multiple tags with commas</small>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Case
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCase;