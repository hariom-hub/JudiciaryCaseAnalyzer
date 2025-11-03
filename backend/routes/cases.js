// const express = require('express');
// const router = express.Router();
// const Case = require('../models/Case');

// // @route   GET /api/cases/stats/overview
// // @desc    Get case statistics overview
// // @access  Public
// router.get('/stats/overview', async (req, res) => {
//   try {
//     const totalCases = await Case.countDocuments();
    
//     const statusStats = await Case.aggregate([
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     const typeStats = await Case.aggregate([
//       {
//         $group: {
//           _id: '$caseType',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const recentCases = await Case.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select('title caseNumber caseType status createdAt');

//     res.json({
//       success: true,
//       data: {
//         totalCases,
//         statusStats: statusStats.reduce((acc, stat) => {
//           acc[stat._id] = stat.count;
//           return acc;
//         }, {}),
//         typeStats: typeStats.reduce((acc, stat) => {
//           acc[stat._id] = stat.count;
//           return acc;
//         }, {}),
//         recentCases
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching case stats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching statistics',
//       error: error.message
//     });
//   }
// });

// // @route   GET /api/cases/search/:query
// // @desc    Search cases by title, case number, or content
// // @access  Public
// router.get('/search/:query', async (req, res) => {
//   try {
//     const { query } = req.params;
//     const { page = 1, limit = 10 } = req.query;
    
//     if (!query || query.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     const searchRegex = new RegExp(query, 'i');
//     const filter = {
//       $or: [
//         { title: searchRegex },
//         { caseNumber: searchRegex },
//         { caseText: searchRegex },
//         { 'parties.plaintiff': searchRegex },
//         { 'parties.defendant': searchRegex },
//         { tags: { $in: [searchRegex] } }
//       ]
//     };

//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const cases = await Case.find(filter)
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip(skip)
//       .select('-caseText');
    
//     const total = await Case.countDocuments(filter);
    
//     res.json({
//       success: true,
//       data: cases,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         total,
//         limit: parseInt(limit)
//       },
//       query
//     });
//   } catch (error) {
//     console.error('Error searching cases:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while searching cases',
//       error: error.message
//     });
//   }
// });

// // @route   GET /api/cases
// // @desc    Get all cases with filtering, pagination, and sorting
// // @access  Public
// router.get('/', async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 10, 
//       type, 
//       status, 
//       priority,
//       sort = 'createdAt',
//       order = 'desc' 
//     } = req.query;
    
//     // Build filter object
//     const filter = {};
//     if (type) filter.caseType = type;
//     if (status) filter.status = status;
//     if (priority) filter.priority = priority;

//     // Calculate pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     // Build sort object
//     const sortOrder = order === 'asc' ? 1 : -1;
//     const sortObj = { [sort]: sortOrder };
    
//     // Get cases with pagination and sorting
//     const cases = await Case.find(filter)
//       .sort(sortObj)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .select('-caseText'); // Exclude full text for list view
    
//     // Get total count for pagination
//     const total = await Case.countDocuments(filter);
    
//     res.json({
//       success: true,
//       data: cases,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         total,
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching cases:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching cases',
//       error: error.message
//     });
//   }
// });

// // @route   GET /api/cases/:id
// // @desc    Get single case by ID
// // @access  Public
// router.get('/:id', async (req, res) => {
//   try {
//     const caseDoc = await Case.findById(req.params.id);
    
//     if (!caseDoc) {
//       return res.status(404).json({
//         success: false,
//         message: 'Case not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: caseDoc
//     });
//   } catch (error) {
//     console.error('Error fetching case:', error);
    
//     // Handle invalid ObjectId
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid case ID format'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching case',
//       error: error.message
//     });
//   }
// });

// // @route   POST /api/cases
// // @desc    Create new case
// // @access  Public
// router.post('/', async (req, res) => {
//   try {
//     console.log('Received case creation request:', JSON.stringify(req.body, null, 2));

//     const {
//       title,
//       caseNumber,
//       caseType,
//       court,
//       judge,
//       jurisdiction,
//       parties,
//       dateOfFiling,
//       dateOfHearing,
//       caseText,
//       summary,
//       status,
//       priority,
//       tags,
//       legalIssues,
//       statutes,
//       claimAmount,
//       currency
//     } = req.body;

//     // Validation
//     if (!title || !caseType || !caseText) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title, case type, and case text are required fields'
//       });
//     }

//     // Validate case text length
//     if (caseText.length < 50) {
//       return res.status(400).json({
//         success: false,
//         message: 'Case text must be at least 50 characters long'
//       });
//     }

//     if (caseText.length > 50000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Case text cannot exceed 50,000 characters'
//       });
//     }

//     // Check if case number already exists (only if provided)
//     if (caseNumber) {
//       const existingCase = await Case.findOne({ caseNumber });
//       if (existingCase) {
//         return res.status(400).json({
//           success: false,
//           message: 'Case with this case number already exists'
//         });
//       }
//     }

//     // Create new case object
//     const caseData = {
//       title: title.trim(),
//       caseType,
//       caseText: caseText.trim(),
//       status: status || 'Pending',
//       priority: priority || 'Medium'
//     };

//     // Add optional fields only if provided
//     if (caseNumber) caseData.caseNumber = caseNumber.trim();
//     if (court) caseData.court = court.trim();
//     if (judge) caseData.judge = judge.trim();
//     if (jurisdiction) caseData.jurisdiction = jurisdiction.trim();
//     if (parties) caseData.parties = parties;
//     if (dateOfFiling) caseData.dateOfFiling = new Date(dateOfFiling);
//     if (dateOfHearing) caseData.dateOfHearing = new Date(dateOfHearing);
//     if (summary) caseData.summary = summary.trim();
//     if (tags && Array.isArray(tags)) caseData.tags = tags;
//     if (legalIssues && Array.isArray(legalIssues)) caseData.legalIssues = legalIssues;
//     if (statutes && Array.isArray(statutes)) caseData.statutes = statutes;
//     if (claimAmount) caseData.claimAmount = parseFloat(claimAmount);
//     if (currency) caseData.currency = currency;

//     const newCase = new Case(caseData);

//     const savedCase = await newCase.save();
    
//     console.log('Case created successfully:', savedCase._id);
    
//     res.status(201).json({
//       success: true,
//       message: 'Case created successfully',
//       data: savedCase
//     });
//   } catch (error) {
//     console.error('Error creating case:', error);
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors
//       });
//     }
    
//     // Handle duplicate key errors
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return res.status(400).json({
//         success: false,
//         message: `Duplicate value for field: ${field}`
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error while creating case',
//       error: error.message
//     });
//   }
// });

// // @route   PUT /api/cases/:id
// // @desc    Update case
// // @access  Public
// router.put('/:id', async (req, res) => {
//   try {
//     console.log('Received case update request for ID:', req.params.id);

//     // Check if case exists
//     const caseDoc = await Case.findById(req.params.id);
//     if (!caseDoc) {
//       return res.status(404).json({
//         success: false,
//         message: 'Case not found'
//       });
//     }

//     const {
//       title,
//       caseNumber,
//       caseType,
//       court,
//       judge,
//       jurisdiction,
//       parties,
//       dateOfFiling,
//       dateOfHearing,
//       caseText,
//       summary,
//       status,
//       priority,
//       tags,
//       legalIssues,
//       statutes,
//       claimAmount,
//       currency
//     } = req.body;

//     // Check if case number is being changed and already exists
//     if (caseNumber && caseNumber !== caseDoc.caseNumber) {
//       const existingCase = await Case.findOne({ 
//         caseNumber,
//         _id: { $ne: req.params.id }
//       });
//       if (existingCase) {
//         return res.status(400).json({
//           success: false,
//           message: 'Case with this case number already exists'
//         });
//       }
//     }

//     // Validate case text length if provided
//     if (caseText) {
//       if (caseText.length < 50) {
//         return res.status(400).json({
//           success: false,
//           message: 'Case text must be at least 50 characters long'
//         });
//       }
//       if (caseText.length > 50000) {
//         return res.status(400).json({
//           success: false,
//           message: 'Case text cannot exceed 50,000 characters'
//         });
//       }
//     }

//     // Build update object with only provided fields
//     const updateData = {};
//     if (title !== undefined) updateData.title = title.trim();
//     if (caseNumber !== undefined) updateData.caseNumber = caseNumber.trim();
//     if (caseType !== undefined) updateData.caseType = caseType;
//     if (court !== undefined) updateData.court = court.trim();
//     if (judge !== undefined) updateData.judge = judge.trim();
//     if (jurisdiction !== undefined) updateData.jurisdiction = jurisdiction.trim();
//     if (parties !== undefined) updateData.parties = parties;
//     if (dateOfFiling !== undefined) updateData.dateOfFiling = new Date(dateOfFiling);
//     if (dateOfHearing !== undefined) updateData.dateOfHearing = new Date(dateOfHearing);
//     if (caseText !== undefined) updateData.caseText = caseText.trim();
//     if (summary !== undefined) updateData.summary = summary.trim();
//     if (status !== undefined) updateData.status = status;
//     if (priority !== undefined) updateData.priority = priority;
//     if (tags !== undefined) updateData.tags = tags;
//     if (legalIssues !== undefined) updateData.legalIssues = legalIssues;
//     if (statutes !== undefined) updateData.statutes = statutes;
//     if (claimAmount !== undefined) updateData.claimAmount = parseFloat(claimAmount);
//     if (currency !== undefined) updateData.currency = currency;

//     const updatedCase = await Case.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     console.log('Case updated successfully:', updatedCase._id);

//     res.json({
//       success: true,
//       message: 'Case updated successfully',
//       data: updatedCase
//     });
//   } catch (error) {
//     console.error('Error updating case:', error);
    
//     // Handle invalid ObjectId
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid case ID format'
//       });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error while updating case',
//       error: error.message
//     });
//   }
// });

// // @route   DELETE /api/cases/:id
// // @desc    Delete case and its analyses
// // @access  Public
// router.delete('/:id', async (req, res) => {
//   try {
//     console.log('Received case deletion request for ID:', req.params.id);

//     const caseDoc = await Case.findById(req.params.id);
    
//     if (!caseDoc) {
//       return res.status(404).json({
//         success: false,
//         message: 'Case not found'
//       });
//     }

//     // Delete the case
//     await Case.findByIdAndDelete(req.params.id);
    
//     // Also delete related analyses
//     const Analysis = require('../models/Analysis');
//     const deletedAnalyses = await Analysis.deleteMany({ caseId: req.params.id });

//     console.log(`Case deleted: ${req.params.id}, Analyses deleted: ${deletedAnalyses.deletedCount}`);

//     res.json({
//       success: true,
//       message: 'Case and related analyses deleted successfully',
//       deletedAnalyses: deletedAnalyses.deletedCount
//     });
//   } catch (error) {
//     console.error('Error deleting case:', error);
    
//     // Handle invalid ObjectId
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid case ID format'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error while deleting case',
//       error: error.message
//     });
//   }
// });

// // @route   POST /api/cases/:id/timeline
// // @desc    Add timeline event to case
// // @access  Public
// router.post('/:id/timeline', async (req, res) => {
//   try {
//     const { date, event, type, description } = req.body;

//     if (!event) {
//       return res.status(400).json({
//         success: false,
//         message: 'Event description is required'
//       });
//     }

//     const caseDoc = await Case.findById(req.params.id);
    
//     if (!caseDoc) {
//       return res.status(404).json({
//         success: false,
//         message: 'Case not found'
//       });
//     }

//     await caseDoc.addTimelineEvent({
//       date: date ? new Date(date) : new Date(),
//       event: event.trim(),
//       type: type || 'other',
//       description: description ? description.trim() : undefined
//     });

//     res.json({
//       success: true,
//       message: 'Timeline event added successfully',
//       data: caseDoc
//     });
//   } catch (error) {
//     console.error('Error adding timeline event:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while adding timeline event',
//       error: error.message
//     });
//   }
// });

// // @route   POST /api/cases/:id/documents
// // @desc    Add document to case
// // @access  Public
// router.post('/:id/documents', async (req, res) => {
//   try {
//     const { name, type, description } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: 'Document name is required'
//       });
//     }

//     const caseDoc = await Case.findById(req.params.id);
    
//     if (!caseDoc) {
//       return res.status(404).json({
//         success: false,
//         message: 'Case not found'
//       });
//     }

//     await caseDoc.addDocument({
//       name: name.trim(),
//       type: type || 'Other',
//       description: description ? description.trim() : undefined
//     });

//     res.json({
//       success: true,
//       message: 'Document added successfully',
//       data: caseDoc
//     });
//   } catch (error) {
//     console.error('Error adding document:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while adding document',
//       error: error.message
//     });
//   }
// });

// module.exports = router;
// backend/routes/cases.js
const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// Create new case
router.post('/', async (req, res) => {
  try {
    console.log('=================================');
    console.log('📥 POST /api/cases called');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body));
    console.log('=================================');
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty or undefined'
      });
    }
    
    const { title, caseType, caseText } = req.body;
    
    if (!title || !caseType || !caseText) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, caseType, caseText',
        received: { title, caseType, caseText }
      });
    }
    
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    
    console.log('✅ Case saved:', savedCase._id);
    
    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: savedCase
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cases.length,
      cases, // 👈 data → cases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single case by ID
router.get('/:id', async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    res.status(200).json({
      success: true,
      data: caseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



module.exports = router;