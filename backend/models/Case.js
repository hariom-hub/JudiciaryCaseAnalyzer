const mongoose = require('mongoose');

// Define the Case schema
const caseSchema = new mongoose.Schema({
  // Basic Case Information
  title: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true,
    maxlength: [200, 'Case title cannot exceed 200 characters']
  },

  caseNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    validate: {
      validator: function(v) {
        // Optional validation pattern for case numbers
        return !v || /^[A-Z]{2}-\d{4}-\d{3}$/.test(v) || /^[A-Z]+[-\d]+$/.test(v);
      },
      message: 'Case number format is invalid'
    }
  },

  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    enum: {
      values: ['Civil', 'Criminal', 'Constitutional', 'Administrative', 'Family', 'Commercial', 'Labor', 'Tax', 'Immigration', 'Environmental', 'Intellectual Property', 'Other'],
      message: 'Invalid case type'
    }
  },

  status: {
    type: String,
    enum: {
      values: ['Active', 'Pending', 'Closed', 'On Hold', 'Dismissed', 'Settled', 'Transferred'],
      message: 'Invalid case status'
    },
    default: 'Pending'
  },

  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High', 'Critical'],
      message: 'Invalid priority level'
    },
    default: 'Medium'
  },

  // Court Information
  court: {
    type: String,
    trim: true,
    maxlength: [100, 'Court name cannot exceed 100 characters']
  },

  judge: {
    type: String,
    trim: true,
    maxlength: [100, 'Judge name cannot exceed 100 characters']
  },

  jurisdiction: {
    type: String,
    trim: true,
    maxlength: [100, 'Jurisdiction cannot exceed 100 characters']
  },

  // Parties Information
  parties: {
    plaintiff: {
      type: String,
      trim: true,
      maxlength: [200, 'Plaintiff name cannot exceed 200 characters']
    },
    defendant: {
      type: String,
      trim: true,
      maxlength: [200, 'Defendant name cannot exceed 200 characters']
    },
    plaintiffLawyer: {
      type: String,
      trim: true,
      maxlength: [200, 'Plaintiff lawyer name cannot exceed 200 characters']
    },
    defendantLawyer: {
      type: String,
      trim: true,
      maxlength: [200, 'Defendant lawyer name cannot exceed 200 characters']
    },
    otherParties: [{
      name: {
        type: String,
        trim: true,
        maxlength: [200, 'Party name cannot exceed 200 characters']
      },
      role: {
        type: String,
        trim: true,
        maxlength: [50, 'Party role cannot exceed 50 characters']
      }
    }]
  },

  // Important Dates
  dateOfFiling: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Filing date cannot be in the future'
    }
  },

  dateOfHearing: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= new Date();
      },
      message: 'Hearing date cannot be in the past'
    }
  },

  dateOfDecision: {
    type: Date
  },

  dateClosed: {
    type: Date,
    validate: {
      validator: function(v) {
        // Only validate if status is 'Closed'
        if (this.status === 'Closed') {
          return v != null;
        }
        return true;
      },
      message: 'Close date is required when case status is Closed'
    }
  },

  // Case Content
  caseText: {
    type: String,
    required: [true, 'Case text/description is required'],
    minlength: [50, 'Case description must be at least 50 characters'],
    maxlength: [50000, 'Case description cannot exceed 50,000 characters']
  },

  summary: {
    type: String,
    maxlength: [2000, 'Case summary cannot exceed 2,000 characters']
  },

  // Financial Information
  claimAmount: {
    type: Number,
    min: [0, 'Claim amount cannot be negative'],
    validate: {
      validator: function(v) {
        return !v || v <= 999999999999; // Max 999 billion
      },
      message: 'Claim amount is too large'
    }
  },

  currency: {
    type: String,
    default: 'USD',
    enum: {
      values: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CHF'],
      message: 'Invalid currency code'
    }
  },

  // Legal Information
  legalIssues: [{
    type: String,
    trim: true,
    maxlength: [500, 'Legal issue description cannot exceed 500 characters']
  }],

  statutes: [{
    type: String,
    trim: true,
    maxlength: [200, 'Statute reference cannot exceed 200 characters']
  }],

  precedents: [{
    caseName: {
      type: String,
      trim: true,
      maxlength: [200, 'Precedent case name cannot exceed 200 characters']
    },
    citation: {
      type: String,
      trim: true,
      maxlength: [100, 'Citation cannot exceed 100 characters']
    },
    relevance: {
      type: String,
      trim: true,
      maxlength: [500, 'Relevance description cannot exceed 500 characters']
    }
  }],

  // Tags and Categories
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },

  // Document Management
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Document name cannot exceed 200 characters']
    },
    type: {
      type: String,
      enum: {
        values: ['Contract', 'Evidence', 'Pleading', 'Motion', 'Order', 'Judgment', 'Correspondence', 'Other'],
        message: 'Invalid document type'
      },
      default: 'Other'
    },
    filePath: {
      type: String,
      trim: true
    },
    fileName: {
      type: String,
      trim: true
    },
    fileSize: {
      type: Number,
      min: [0, 'File size cannot be negative']
    },
    mimeType: {
      type: String,
      trim: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Document description cannot exceed 500 characters']
    }
  }],

  // Timeline and History
  timeline: [{
    date: {
      type: Date,
      required: true
    },
    event: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Timeline event cannot exceed 500 characters']
    },
    type: {
      type: String,
      enum: {
        values: ['filing', 'hearing', 'motion', 'order', 'settlement', 'appeal', 'decision', 'other'],
        message: 'Invalid timeline event type'
      },
      default: 'other'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Timeline description cannot exceed 1,000 characters']
    },
    addedBy: {
      type: String,
      trim: true,
      maxlength: [100, 'AddedBy field cannot exceed 100 characters']
    }
  }],

  // Analysis Information
  analysisCount: {
    type: Number,
    default: 0,
    min: [0, 'Analysis count cannot be negative']
  },

  lastAnalysisDate: {
    type: Date
  },

  // Outcome Information
  outcome: {
    result: {
      type: String,
      enum: {
        values: ['Won', 'Lost', 'Settled', 'Dismissed', 'Pending', 'Unknown'],
        message: 'Invalid case outcome'
      }
    },
    awardAmount: {
      type: Number,
      min: [0, 'Award amount cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Outcome description cannot exceed 1,000 characters']
    }
  },

  // Metadata
  createdBy: {
    type: String,
    trim: true,
    maxlength: [100, 'CreatedBy field cannot exceed 100 characters']
  },

  lastModifiedBy: {
    type: String,
    trim: true,
    maxlength: [100, 'LastModifiedBy field cannot exceed 100 characters']
  },

  isArchived: {
    type: Boolean,
    default: false
  },

  isConfidential: {
    type: Boolean,
    default: false
  },

  accessLevel: {
    type: String,
    enum: {
      values: ['Public', 'Internal', 'Confidential', 'Restricted'],
      message: 'Invalid access level'
    },
    default: 'Internal'
  },

  notes: {
    type: String,
    trim: true,
    maxlength: [5000, 'Notes cannot exceed 5,000 characters']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ caseType: 1 });
caseSchema.index({ createdAt: -1 });
caseSchema.index({ dateOfFiling: -1 });
caseSchema.index({ tags: 1 });
caseSchema.index({ 'parties.plaintiff': 'text', 'parties.defendant': 'text' });
caseSchema.index({ title: 'text', caseText: 'text' }); // Full-text search

// Virtual properties
caseSchema.virtual('daysSinceFiling').get(function() {
  if (!this.dateOfFiling) return null;
  const diffTime = Math.abs(new Date() - this.dateOfFiling);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

caseSchema.virtual('isOverdue').get(function() {
  if (!this.dateOfHearing) return false;
  return this.dateOfHearing < new Date() && this.status !== 'Closed';
});

caseSchema.virtual('duration').get(function() {
  if (!this.dateOfFiling) return null;
  const endDate = this.dateClosed || new Date();
  const diffTime = Math.abs(endDate - this.dateOfFiling);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
caseSchema.pre('save', function(next) {
  // Auto-generate case number if not provided
  if (!this.caseNumber && this.isNew) {
    const prefix = this.caseType.substring(0, 2).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.caseNumber = `${prefix}-${year}-${random}`;
  }

  // Update lastModifiedBy timestamp
  this.updatedAt = new Date();

  // Validate close date logic
  if (this.status === 'Closed' && !this.dateClosed) {
    this.dateClosed = new Date();
  }

  // Auto-generate summary if not provided
  if (!this.summary && this.caseText) {
    this.summary = this.caseText.substring(0, 200) + (this.caseText.length > 200 ? '...' : '');
  }

  next();
});

// Pre-delete middleware to handle cascading deletes
caseSchema.pre('findOneAndDelete', async function(next) {
  const caseId = this.getQuery()._id;
  // Delete associated analyses when case is deleted
  await mongoose.model('Analysis').deleteMany({ caseId: caseId });
  next();
});

// Static methods
caseSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

caseSchema.statics.findByCaseType = function(caseType) {
  return this.find({ caseType: caseType });
};

caseSchema.statics.searchCases = function(query) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { caseNumber: { $regex: query, $options: 'i' } },
      { 'parties.plaintiff': { $regex: query, $options: 'i' } },
      { 'parties.defendant': { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  });
};

// Instance methods
caseSchema.methods.addDocument = function(documentData) {
  this.documents.push(documentData);
  return this.save();
};

caseSchema.methods.addTimelineEvent = function(eventData) {
  this.timeline.push({
    ...eventData,
    date: eventData.date || new Date()
  });
  // Sort timeline by date
  this.timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
  return this.save();
};

caseSchema.methods.updateAnalysisCount = function() {
  return mongoose.model('Analysis').countDocuments({ caseId: this._id })
    .then(count => {
      this.analysisCount = count;
      this.lastAnalysisDate = new Date();
      return this.save();
    });
};

caseSchema.methods.getPublicView = function() {
  const obj = this.toObject();
  if (this.isConfidential) {
    // Remove sensitive information for confidential cases
    delete obj.caseText;
    delete obj.parties;
    delete obj.claimAmount;
    delete obj.documents;
    delete obj.notes;
  }
  return obj;
};

// Create and export the model
const Case = mongoose.model('Case', caseSchema);

module.exports = Case;