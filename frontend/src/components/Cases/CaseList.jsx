import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './CaseCard';
import caseService from '../../services/caseService';
import { CASE_TYPES, CASE_STATUS } from '../../utils/constants';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredCases, setFilteredCases] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(12);

  // Fetch cases on mount
  useEffect(() => {
    fetchCases();
  }, []);

  // Apply filters when cases or filters change
  useEffect(() => {
    applyFilters();
  }, [cases, filters]);

  // Fetch all cases
  const fetchCases = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await caseService.getAllCases();
      
      console.log('Fetched cases:', response);
      
      if (response.success) {
        setCases(response.data || []);
      } else {
        setCases([]);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError('Failed to load cases. Please try again.');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...cases];

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(c => c.caseType === filters.type);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(searchLower) ||
        c.caseNumber?.toLowerCase().includes(searchLower) ||
        c.parties?.plaintiff?.toLowerCase().includes(searchLower) ||
        c.parties?.defendant?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCases(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      search: ''
    });
  };

  // Delete case
  const handleDelete = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      return;
    }

    try {
      await caseService.deleteCase(caseId);
      // Refresh cases list
      fetchCases();
      alert('Case deleted successfully');
    } catch (err) {
      console.error('Error deleting case:', err);
      alert('Failed to delete case. Please try again.');
    }
  };

  // Pagination logic
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-folder2-open me-2"></i>
            All Cases
          </h2>
          <p className="text-muted mb-0">
            Showing {filteredCases.length} of {cases.length} cases
          </p>
        </div>
        <Link to="/add-case" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Case
        </Link>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-4">
              <label htmlFor="search" className="form-label">
                <i className="bi bi-search me-1"></i>
                Search
              </label>
              <input
                type="text"
                className="form-control"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title, case number, parties..."
              />
            </div>

            {/* Type Filter */}
            <div className="col-md-3">
              <label htmlFor="type" className="form-label">
                <i className="bi bi-filter me-1"></i>
                Case Type
              </label>
              <select
                className="form-select"
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {CASE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-md-3">
              <label htmlFor="status" className="form-label">
                <i className="bi bi-flag me-1"></i>
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                {Object.values(CASE_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading cases...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredCases.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-folder-x display-1 text-muted"></i>
              <h4 className="mt-3">No Cases Found</h4>
              <p className="text-muted">
                {cases.length === 0 
                  ? "You haven't added any cases yet."
                  : "No cases match your current filters."}
              </p>
              {cases.length === 0 ? (
                <Link to="/add-case" className="btn btn-primary mt-3">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Case
                </Link>
              ) : (
                <button className="btn btn-secondary mt-3" onClick={clearFilters}>
                  <i className="bi bi-x-circle me-2"></i>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Cases Grid */}
              <div className="row g-4 mb-4">
                {currentCases.map((caseItem) => (
                  <div key={caseItem._id} className="col-lg-4 col-md-6">
                    <CaseCard 
                      caseData={caseItem} 
                      onDelete={handleDelete}
                      onRefresh={fetchCases}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Case pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => paginate(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <li key={pageNumber} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CaseList;