const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');
const Case = require('../models/Case');
const openaiService = require('../services/openaiService');
const geminiService = require('../services/geminiService');
const groqService = require('../services/groqService');
// @route   POST /api/analysis
// @desc    Create new AI analysis for a case
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            caseId,
            analysisType,
            aiProvider,
            apiKey,
            model,
            prompt
        } = req.body;

        // Validation
        if (!caseId || !analysisType || !aiProvider || !apiKey) {
            return res.status(400).json({
                success: false,
                message: 'Case ID, analysis type, AI provider, and API key are required'
            });
        }

        // Check if case exists
        const case_doc = await Case.findById(caseId);
        if (!case_doc) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        // Validate analysis type
        const validTypes = ['summary', 'legal_issues', 'precedents', 'outcome_prediction'];
        if (!validTypes.includes(analysisType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid analysis type. Must be one of: ' + validTypes.join(', ')
            });
        }

        // Validate AI provider
        const validProviders = ['openai', 'gemini', 'groq'];
        if (!validProviders.includes(aiProvider)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid AI provider. Must be one of: ' + validProviders.join(', ')
            });
        }

        // Check if analysis already exists for this case and type
        const existingAnalysis = await Analysis.findOne({
            caseId,
            analysisType
        });

        let analysisResult;
        let aiResponse;

        try {
            // Generate AI analysis based on provider
            if (aiProvider === 'openai') {
                aiResponse = await openaiService.analyzeCase(
                    case_doc,
                    analysisType,
                    apiKey,
                    model || 'gpt-3.5-turbo',
                    prompt
                );
                
            }
            if (aiProvider === 'groq') {
                aiResponse = await groqService.analyzeCase(
                    case_doc,
                    analysisType,
                    model || 'llama3-8b-8192'
                );
            } else if (aiProvider === 'gemini') {
                aiResponse = await geminiService.analyzeCase(
                    case_doc,
                    analysisType,
                    apiKey,
                    model || 'gemini-pro',
                    prompt
                );
            }

            // Create or update analysis
            if (existingAnalysis) {
                // Update existing analysis
                analysisResult = await Analysis.findByIdAndUpdate(
                    existingAnalysis._id,
                    {
                        result: aiResponse.result,
                        aiProvider,
                        model: aiResponse.model,
                        promptUsed: aiResponse.prompt,
                        tokensUsed: aiResponse.tokensUsed,
                        processingTime: aiResponse.processingTime,
                        updatedAt: new Date()
                    },
                    { new: true, runValidators: true }
                );
            } else {
                // Create new analysis
                const newAnalysis = new Analysis({
                    caseId,
                    analysisType,
                    result: aiResponse.result,
                    aiProvider,
                    model: aiResponse.model,
                    promptUsed: aiResponse.prompt,
                    tokensUsed: aiResponse.tokensUsed,
                    processingTime: aiResponse.processingTime
                });

                analysisResult = await newAnalysis.save();
            }

            res.status(existingAnalysis ? 200 : 201).json({
                success: true,
                message: existingAnalysis ? 'Analysis updated successfully' : 'Analysis created successfully',
                data: analysisResult
            });

        } catch (aiError) {
            console.error('AI Analysis Error:', aiError);

            // Handle specific AI service errors
            if (aiError.message.includes('API key')) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired API key'
                });
            }

            if (aiError.message.includes('quota') || aiError.message.includes('limit')) {
                return res.status(429).json({
                    success: false,
                    message: 'API quota exceeded. Please try again later.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error processing AI analysis: ' + aiError.message
            });
        }

    } catch (error) {
        console.error('Error creating analysis:', error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid case ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating analysis',
            error: error.message
        });
    }
});

// @route   GET /api/analysis/case/:caseId
// @desc    Get all analyses for a specific case
// @access  Public
router.get('/case/:caseId', async (req, res) => {
    try {
        const { caseId } = req.params;
        const { type } = req.query; // Optional filter by analysis type

        // Check if case exists
        const case_doc = await Case.findById(caseId);
        if (!case_doc) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        // Build filter
        const filter = { caseId };
        if (type) {
            filter.analysisType = type;
        }

        const analyses = await Analysis.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: analyses,
            caseTitle: case_doc.title
        });
    } catch (error) {
        console.error('Error fetching case analyses:', error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid case ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching analyses',
            error: error.message
        });
    }
});

// @route   GET /api/analysis/:id
// @desc    Get specific analysis by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id)
            .populate('caseId', 'title caseNumber caseType');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            data: analysis
        });
    } catch (error) {
        console.error('Error fetching analysis:', error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid analysis ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching analysis',
            error: error.message
        });
    }
});

// @route   DELETE /api/analysis/:id
// @desc    Delete specific analysis
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        await Analysis.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Analysis deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting analysis:', error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid analysis ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while deleting analysis',
            error: error.message
        });
    }
});

// @route   POST /api/analysis/batch
// @desc    Create multiple analyses for a case at once
// @access  Public
router.post('/batch', async (req, res) => {
    try {
        const {
            caseId,
            analysisTypes,
            aiProvider,
            apiKey,
            model
        } = req.body;

        // Validation
        if (!caseId || !analysisTypes || !Array.isArray(analysisTypes) || !aiProvider || !apiKey) {
            return res.status(400).json({
                success: false,
                message: 'Case ID, analysis types array, AI provider, and API key are required'
            });
        }

        // Check if case exists
        const case_doc = await Case.findById(caseId);
        if (!case_doc) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        const validTypes = ['summary', 'legal_issues', 'precedents', 'outcome_prediction'];
        const invalidTypes = analysisTypes.filter(type => !validTypes.includes(type));

        if (invalidTypes.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid analysis types: ${invalidTypes.join(', ')}`
            });
        }

        const results = [];
        const errors = [];

        // Process each analysis type
        for (const analysisType of analysisTypes) {
            try {
                let aiResponse;

                if (aiProvider === 'openai') {
                    aiResponse = await openaiService.analyzeCase(
                        case_doc,
                        analysisType,
                        apiKey,
                        model || 'gpt-3.5-turbo'
                    );
                } else if (aiProvider === 'gemini') {
                    aiResponse = await geminiService.analyzeCase(
                        case_doc,
                        analysisType,
                        apiKey,
                        model || 'gemini-pro'
                    );
                }

                // Check if analysis already exists
                const existingAnalysis = await Analysis.findOne({
                    caseId,
                    analysisType
                });

                let analysisResult;

                if (existingAnalysis) {
                    // Update existing
                    analysisResult = await Analysis.findByIdAndUpdate(
                        existingAnalysis._id,
                        {
                            result: aiResponse.result,
                            aiProvider,
                            model: aiResponse.model,
                            promptUsed: aiResponse.prompt,
                            tokensUsed: aiResponse.tokensUsed,
                            processingTime: aiResponse.processingTime,
                            updatedAt: new Date()
                        },
                        { new: true, runValidators: true }
                    );
                } else {
                    // Create new
                    const newAnalysis = new Analysis({
                        caseId,
                        analysisType,
                        result: aiResponse.result,
                        aiProvider,
                        model: aiResponse.model,
                        promptUsed: aiResponse.prompt,
                        tokensUsed: aiResponse.tokensUsed,
                        processingTime: aiResponse.processingTime
                    });

                    analysisResult = await newAnalysis.save();
                }

                results.push({
                    analysisType,
                    success: true,
                    data: analysisResult
                });

            } catch (analysisError) {
                console.error(`Error processing ${analysisType} analysis:`, analysisError);
                errors.push({
                    analysisType,
                    success: false,
                    error: analysisError.message
                });
            }
        }

        const response = {
            success: results.length > 0,
            message: `Processed ${results.length} analyses successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
            results,
            errors: errors.length > 0 ? errors : undefined
        };

        res.status(results.length > 0 ? 200 : 500).json(response);

    } catch (error) {
        console.error('Error creating batch analyses:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating batch analyses',
            error: error.message
        });
    }
});

// @route   GET /api/analysis/stats/overview
// @desc    Get analysis statistics overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
    try {
        const totalAnalyses = await Analysis.countDocuments();

        const typeStats = await Analysis.aggregate([
            {
                $group: {
                    _id: '$analysisType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const providerStats = await Analysis.aggregate([
            {
                $group: {
                    _id: '$aiProvider',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentAnalyses = await Analysis.find()
            .populate('caseId', 'title caseNumber')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('analysisType aiProvider model createdAt processingTime tokensUsed');

        res.json({
            success: true,
            data: {
                totalAnalyses,
                typeStats: typeStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                providerStats: providerStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                recentAnalyses
            }
        });
    } catch (error) {
        console.error('Error fetching analysis stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;