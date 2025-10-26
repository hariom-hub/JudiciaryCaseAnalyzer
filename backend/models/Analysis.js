const mongoose = require('mongoose');

// Define the Analysis schema
const analysisSchema = new mongoose.Schema({
  // Reference to the Case
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: [true, 'Case ID is required'],
    index: true
  },

  // Analysis Type
  analysisType: {
    type: String,
    required: [true, 'Analysis type is required'],
    enum: {
      values: [
        'summary',
        'legal_issues', 
        'precedents',
        'outcome_prediction',
        'risk_assessment',
        'strategy_recommendation',
        'document_analysis',
        'settlement_evaluation',
        'compliance_check',
        'evidence_evaluation',
        'witness_analysis',
        'timeline_analysis'
      ],
      message: 'Invalid analysis type'
    },
    index: true
  },

  // AI Provider Information
  aiProvider: {
    type: String,
    required: [true, 'AI provider is required'],
    enum: {
      values: ['openai', 'gemini', 'groq', 'claude', 'custom'],
      message: 'Invalid AI provider'
    },
    index: true
  },

  model: {
    type: String,
    required: [true, 'AI model is required'],
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters'],
    validate: {
      validator: function(v) {
        // Validate model names based on provider
        const modelValidation = {
          'openai': ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
          'gemini': ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro'],
          'groq': ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
          'claude': ['claude-3-sonnet', 'claude-3-opus', 'claude-3-haiku'],
          'custom': [] // No validation for custom models
        };
        
        if (this.aiProvider === 'custom') return true;
        return modelValidation[this.aiProvider]?.includes(v) || false;
      },
      message: 'Invalid model for the selected AI provider'
    }
  },

  // Request Configuration
  requestConfig: {
    temperature: {
      type: Number,
      min: [0, 'Temperature must be between 0 and 2'],
      max: [2, 'Temperature must be between 0 and 2'],
      default: 0.3
    },
    maxTokens: {
      type: Number,
      min: [1, 'Max tokens must be at least 1'],
      max: [32768, 'Max tokens cannot exceed 32768'],
      default: 2000
    },
    topP: {
      type: Number,
      min: [0, 'Top P must be between 0 and 1'],
      max: [1, 'Top P must be between 0 and 1'],
      default: 0.9
    },
    frequencyPenalty: {
      type: Number,
      min: [-2, 'Frequency penalty must be between -2 and 2'],
      max: [2, 'Frequency penalty must be between -2 and 2'],
      default: 0
    },
    presencePenalty: {
      type: Number,
      min: [-2, 'Presence penalty must be between -2 and 2'],
      max: [2, 'Presence penalty must be between -2 and 2'],
      default: 0
    }
  },

  // Prompt Information
  promptUsed: {
    type: String,
    required: [true, 'Prompt is required'],
    minlength: [10, 'Prompt must be at least 10 characters'],
    maxlength: [20000, 'Prompt cannot exceed 20,000 characters']
  },

  promptTemplate: {
    type: String,
    enum: {
      values: [
        'case_summary',
        'legal_analysis', 
        'precedent_research',
        'outcome_prediction',
        'risk_assessment',
        'strategy_planning',
        'document_review',
        'custom'
      ],
      message: 'Invalid prompt template'
    },
    default: 'custom'
  },

  // Analysis Result
  result: {
    type: String,
    required: [true, 'Analysis result is required'],
    minlength: [1, 'Analysis result cannot be empty'],
    maxlength: [100000, 'Analysis result cannot exceed 100,000 characters']
  },

  // Structured Analysis Results
  structuredResult: {
    keyFindings: [{
      type: String,
      trim: true,
      maxlength: [1000, 'Key finding cannot exceed 1000 characters']
    }],
    
    legalIssues: [{
      issue: {
        type: String,
        trim: true,
        maxlength: [500, 'Legal issue cannot exceed 500 characters']
      },
      severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
      },
      recommendation: {
        type: String,
        trim: true,
        maxlength: [1000, 'Recommendation cannot exceed 1000 characters']
      }
    }],

    precedents: [{
      caseName: {
        type: String,
        trim: true,
        maxlength: [200, 'Case name cannot exceed 200 characters']
      },
      citation: {
        type: String,
        trim: true,
        maxlength: [100, 'Citation cannot exceed 100 characters']
      },
      relevanceScore: {
        type: Number,
        min: [0, 'Relevance score must be between 0 and 100'],
        max: [100, 'Relevance score must be between 0 and 100']
      },
      summary: {
        type: String,
        trim: true,
        maxlength: [1000, 'Precedent summary cannot exceed 1000 characters']
      }
    }],

    outcomeAnalysis: {
      successProbability: {
        type: Number,
        min: [0, 'Success probability must be between 0 and 100'],
        max: [100, 'Success probability must be between 0 and 100']
      },
      riskFactors: [{
        factor: {
          type: String,
          trim: true,
          maxlength: [200, 'Risk factor cannot exceed 200 characters']
        },
        impact: {
          type: String,
          enum: ['Low', 'Medium', 'High', 'Critical'],
          default: 'Medium'
        },
        mitigation: {
          type: String,
          trim: true,
          maxlength: [500, 'Mitigation strategy cannot exceed 500 characters']
        }
      }],
      estimatedTimeline: {
        type: String,
        trim: true,
        maxlength: [200, 'Timeline estimate cannot exceed 200 characters']
      },
      estimatedCosts: {
        min: {
          type: Number,
          min: [0, 'Minimum cost cannot be negative']
        },
        max: {
          type: Number,
          min: [0, 'Maximum cost cannot be negative']
        },
        currency: {
          type: String,
          default: 'USD',
          enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CHF']
        }
      }
    },

    recommendations: [{
      category: {
        type: String,
        enum: ['Strategy', 'Legal', 'Procedural', 'Settlement', 'Evidence', 'Other'],
        default: 'Other'
      },
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
      },
      action: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Recommendation action cannot exceed 500 characters']
      },
      rationale: {
        type: String,
        trim: true,
        maxlength: [1000, 'Rationale cannot exceed 1000 characters']
      },
      deadline: {
        type: Date
      }
    }],

    confidence: {
      overall: {
        type: Number,
        min: [0, 'Confidence must be between 0 and 100'],
        max: [100, 'Confidence must be between 0 and 100'],
        default: 50
      },
      dataQuality: {
        type: Number,
        min: [0, 'Data quality score must be between 0 and 100'],
        max: [100, 'Data quality score must be between 0 and 100'],
        default: 50
      },
      reasoning: {
        type: String,
        trim: true,
        maxlength: [500, 'Confidence reasoning cannot exceed 500 characters']
      }
    }
  },

  // Performance Metrics
  tokensUsed: {
    prompt: {
      type: Number,
      min: [0, 'Prompt tokens cannot be negative'],
      default: 0
    },
    completion: {
      type: Number,
      min: [0, 'Completion tokens cannot be negative'],
      default: 0
    },
    total: {
      type: Number,
      min: [0, 'Total tokens cannot be negative'],
      default: 0
    }
  },

  processingTime: {
    type: Number, // in milliseconds
    min: [0, 'Processing time cannot be negative'],
    required: [true, 'Processing time is required']
  },

  cost: {
    amount: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
      default: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CHF']
    }
  },

  // Status and Quality
  status: {
    type: String,
    enum: {
      values: ['Processing', 'Completed', 'Failed', 'Cancelled', 'Queued'],
      message: 'Invalid analysis status'
    },
    default: 'Processing',
    index: true
  },

  qualityScore: {
    type: Number,
    min: [0, 'Quality score must be between 0 and 100'],
    max: [100, 'Quality score must be between 0 and 100']
  },

  // Error Handling
  errorInfo: {
    code: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Error message cannot exceed 1000 characters']
    },
    details: {
      type: String,
      trim: true,
      maxlength: [5000, 'Error details cannot exceed 5000 characters']
    },
    retryCount: {
      type: Number,
      min: [0, 'Retry count cannot be negative'],
      default: 0
    }
  },

  // User Feedback
  userRating: {
    accuracy: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    usefulness: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    clarity: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    overall: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [2000, 'Feedback cannot exceed 2000 characters']
    }
  },

  // Metadata
  version: {
    type: String,
    default: '1.0',
    trim: true
  },

  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  isBookmarked: {
    type: Boolean,
    default: false
  },

  isArchived: {
    type: Boolean,
    default: false
  },

  createdBy: {
    type: String,
    trim: true,
    maxlength: [100, 'CreatedBy field cannot exceed 100 characters']
  },

  reviewedBy: {
    type: String,
    trim: true,
    maxlength: [100, 'ReviewedBy field cannot exceed 100 characters']
  },

  reviewedAt: {
    type: Date
  },

  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
analysisSchema.index({ caseId: 1, analysisType: 1 });
analysisSchema.index({ aiProvider: 1, model: 1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ 'userRating.overall': -1 });
analysisSchema.index({ qualityScore: -1 });
analysisSchema.index({ tags: 1 });

// Compound indexes for complex queries
analysisSchema.index({ caseId: 1, status: 1, createdAt: -1 });
analysisSchema.index({ aiProvider: 1, analysisType: 1, createdAt: -1 });

// Virtual properties
analysisSchema.virtual('averageRating').get(function() {
  if (!this.userRating) return null;
  
  const ratings = [
    this.userRating.accuracy,
    this.userRating.usefulness,
    this.userRating.clarity
  ].filter(rating => rating != null);
  
  if (ratings.length === 0) return null;
  
  return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;
});

analysisSchema.virtual('efficiency').get(function() {
  if (!this.processingTime || !this.tokensUsed.total) return null;
  return Math.round((this.tokensUsed.total / this.processingTime) * 1000); // tokens per second
});

analysisSchema.virtual('costPerToken').get(function() {
  if (!this.cost.amount || !this.tokensUsed.total) return null;
  return Math.round((this.cost.amount / this.tokensUsed.total) * 100000) / 100000; // cost per token
});

analysisSchema.virtual('isRecent').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Pre-save middleware
analysisSchema.pre('save', function(next) {
  // Calculate total tokens if not provided
  if (this.tokensUsed.prompt && this.tokensUsed.completion) {
    this.tokensUsed.total = this.tokensUsed.prompt + this.tokensUsed.completion;
  }

  // Auto-calculate overall rating if individual ratings are provided
  if (this.userRating && !this.userRating.overall) {
    const ratings = [
      this.userRating.accuracy,
      this.userRating.usefulness,
      this.userRating.clarity
    ].filter(rating => rating != null);
    
    if (ratings.length > 0) {
      this.userRating.overall = Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length);
    }
  }

  // Set completion timestamp when status changes to completed
  if (this.status === 'Completed' && this.isModified('status')) {
    this.completedAt = new Date();
  }

  next();
});

// Post-save middleware to update case analysis count
analysisSchema.post('save', async function(doc) {
  if (doc.status === 'Completed' && doc.isModified('status')) {
    try {
      const Case = mongoose.model('Case');
      const case_doc = await Case.findById(doc.caseId);
      if (case_doc) {
        await case_doc.updateAnalysisCount();
      }
    } catch (error) {
      console.error('Error updating case analysis count:', error);
    }
  }
});

// Static methods
analysisSchema.statics.findByCase = function(caseId) {
  return this.find({ caseId }).sort({ createdAt: -1 });
};

analysisSchema.statics.findByProvider = function(provider) {
  return this.find({ aiProvider: provider }).sort({ createdAt: -1 });
};

analysisSchema.statics.findByType = function(analysisType) {
  return this.find({ analysisType }).sort({ createdAt: -1 });
};

analysisSchema.statics.getAnalyticsData = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: {
          provider: '$aiProvider',
          type: '$analysisType'
        },
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$processingTime' },
        avgCost: { $avg: '$cost.amount' },
        avgRating: { $avg: '$userRating.overall' },
        totalTokens: { $sum: '$tokensUsed.total' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

analysisSchema.statics.getPerformanceMetrics = function(aiProvider, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        aiProvider,
        createdAt: { $gte: startDate },
        status: 'Completed'
      }
    },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        avgProcessingTime: { $avg: '$processingTime' },
        avgCost: { $avg: '$cost.amount' },
        avgRating: { $avg: '$userRating.overall' },
        totalTokensUsed: { $sum: '$tokensUsed.total' },
        avgQualityScore: { $avg: '$qualityScore' }
      }
    }
  ]);
};

// Instance methods
analysisSchema.methods.markAsReviewed = function(reviewedBy) {
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  return this.save();
};

analysisSchema.methods.addUserFeedback = function(rating, feedback) {
  this.userRating = rating;
  if (feedback) {
    this.userRating.feedback = feedback;
  }
  return this.save();
};

analysisSchema.methods.calculateQualityScore = function() {
  let score = 0;
  let factors = 0;

  // Factor 1: User rating (40% weight)
  if (this.userRating && this.userRating.overall) {
    score += (this.userRating.overall / 5) * 40;
    factors++;
  }

  // Factor 2: Structured result completeness (30% weight)
  if (this.structuredResult) {
    let completeness = 0;
    if (this.structuredResult.keyFindings?.length > 0) completeness += 25;
    if (this.structuredResult.recommendations?.length > 0) completeness += 25;
    if (this.structuredResult.confidence?.overall != null) completeness += 25;
    if (this.structuredResult.outcomeAnalysis?.successProbability != null) completeness += 25;
    
    score += (completeness / 100) * 30;
    factors++;
  }

  // Factor 3: Processing efficiency (20% weight)
  if (this.processingTime && this.tokensUsed.total) {
    const efficiency = Math.min(this.tokensUsed.total / this.processingTime * 1000, 100);
    score += (efficiency / 100) * 20;
    factors++;
  }

  // Factor 4: Result length adequacy (10% weight)
  if (this.result) {
    const idealLength = 2000; // characters
    const lengthScore = Math.min(this.result.length / idealLength, 1) * 100;
    score += (lengthScore / 100) * 10;
    factors++;
  }

  this.qualityScore = factors > 0 ? Math.round(score / factors * 100) / 100 : null;
  return this.qualityScore;
};

analysisSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.analysisType,
    provider: this.aiProvider,
    model: this.model,
    status: this.status,
    qualityScore: this.qualityScore,
    processingTime: this.processingTime,
    tokensUsed: this.tokensUsed.total,
    cost: this.cost.amount,
    rating: this.userRating?.overall,
    createdAt: this.createdAt
  };
};

// Create and export the model
const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;