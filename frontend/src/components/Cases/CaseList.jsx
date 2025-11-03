import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './CaseCard';
import caseService from '../../services/caseService';
import { CASE_TYPES, CASE_STATUS } from '../../utils/constants';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      console.log('📥 API Response from /api/cases:', response);

      if (response.success) {
        // Support both response.data and response.cases
        const caseList = response.data || response.cases || [];
        setCases(caseList);
      } else if (Array.isArray(response)) {
        setCases(response);
      } else {
        setCases([]);
      }
    } catch (err) {
      console.error('❌ Error fetching cases:', err);
      setError('Failed to load cases. Please try again.');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...cases];

    if (filters.type) {
      filtered = filtered.filter(c => c.caseType?.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.status?.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(searchLower) ||
        c.caseNumber?.toLowerCase().includes(searchLower) ||
        (c.parties?.plaintiff || '').toLowerCase().includes(searchLower) ||
        (c.parties?.defendant || '').toLowerCase().includes(searchLower)
      );
    }

    setFilteredCases(filtered);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ type: '', status: '', search: '' });
  };

  // Delete case
  const handleDelete = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;
    try {
      await caseService.deleteCase(caseId);
      fetchCases();
      alert('✅ Case deleted successfully');
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
            <i className="bi bi-folder2-open me-2"></i>All Cases
          </h2>
          <p className="text-muted mb-0">
            Showing {filteredCases.length} of {cases.length} cases
          </p>
        </div>
        <Link to="/add-case" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Add New Case
        </Link>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-4">
              <label className="form-label"><i className="bi bi-search me-1"></i>Search</label>
              <input
                type="text"
                className="form-control"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title, case number, parties..."
              />
            </div>

            {/* Type Filter */}
            <div className="col-md-3">
              <label className="form-label"><i className="bi bi-filter me-1"></i>Case Type</label>
              <select
                className="form-select"
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
              <label className="form-label"><i className="bi bi-flag me-1"></i>Status</label>
              <select
                className="form-select"
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
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                <i className="bi bi-x-circle me-1"></i>Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading cases...</p>
        </div>
      ) : (
        <>
          {filteredCases.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-folder-x display-1 text-muted"></i>
              <h4 className="mt-3">No Cases Found</h4>
              <p className="text-muted">
                {cases.length === 0 ? "You haven't added any cases yet." : "No cases match your filters."}
              </p>
              <Link to="/add-case" className="btn btn-primary mt-3">
                <i className="bi bi-plus-circle me-2"></i>Add Case
              </Link>
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
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 || page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(page)}>
                              {page}
                            </button>
                          </li>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                      }
                      return null;
                    })}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => paginate(currentPage + 1)}>
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
