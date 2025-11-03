
// const mongoose = require('mongoose');

// const CaseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Case title is required'],
//     trim: true
//   },
//   caseNumber: {
//     type: String,
//     trim: true,
//     unique: true,
//     sparse: true
//   },
//   caseType: {
//     type: String,
//     required: [true, 'Case type is required'],
//     enum: ['civil', 'administrative', 'criminal', 'family', 'corporate', 'constitutional', 'labor', 
//            'property', 'intellectual', 'tax', 'immigration', 'environmental', 'other'],
//     lowercase: true
//   },
//   caseText: {
//     type: String,
//     required: [true, 'Case text is required']
//   },
//   court: {
//     type: String,
//     trim: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'active', 'under_review', 'hearing', 'judgment', 
//            'closed', 'dismissed', 'settled', 'appealed'],
//     default: 'pending',
//     lowercase: true
//   },
//   plaintiffs: [{
//     type: String,
//     trim: true
//   }],
//   defendants: [{
//     type: String,
//     trim: true
//   }],
//   filingDate: {
//     type: Date,
//     default: Date.now
//   },
//   description: {
//     type: String,
//     trim: true
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Case', CaseSchema);

// backend/models/Case.js
const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true
  },
  caseNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    enum: [
      'civil', 'administrative', 'criminal', 'family', 'corporate',
      'constitutional', 'labor', 'property', 'intellectual',
      'tax', 'immigration', 'environmental', 'other'
    ],
    lowercase: true
  },
  caseText: {
    type: String,
    required: [true, 'Case text is required']
  },
  court: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: [
      'pending', 'active', 'under_review', 'hearing', 'judgment',
      'closed', 'dismissed', 'settled', 'appealed'
    ],
    default: 'pending',
    lowercase: true
  },
  plaintiffs: [{
    type: String,
    trim: true
  }],
  defendants: [{
    type: String,
    trim: true
  }],
  filingDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// ✅ Normalize caseType before validation (extra safety)
CaseSchema.pre('validate', function (next) {
  if (this.caseType) {
    this.caseType = this.caseType.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
