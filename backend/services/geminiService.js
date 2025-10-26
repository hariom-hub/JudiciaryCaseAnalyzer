const axios = require('axios');

const analysisPrompts = {
  summary: `You are an expert legal analyst. Provide a concise summary of this legal case including:
- Key facts and background
- Parties involved  
- Main legal issues
- Court decision (if available)
- Significance of the case

Case Text:`,

  legal_issues: `You are an expert legal analyst. Identify and analyze the main legal issues in this case:
- Primary legal questions presented
- Areas of law involved
- Constitutional or statutory provisions
- Legal principles at stake
- Jurisdictional issues

Case Text:`,

  precedents: `You are an expert legal analyst. Analyze relevant legal precedents for this case:
- Key precedent cases that apply
- How precedents support each party's position
- Distinguishing factors from precedent cases
- Evolution of relevant legal doctrine
- Potential impact on future cases

Case Text:`,

  outcome_prediction: `You are an expert legal analyst. Analyze the likely outcome of this case:
- Strengths and weaknesses of each party's arguments
- Relevant precedents and their application
- Policy considerations
- Most probable outcome with reasoning
- Alternative scenarios

Case Text:`
};

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async analyzeCase(caseText, analysisType, model = 'gemini-pro') {
    try {
      if (!caseText || !analysisType) {
        throw new Error('Case text and analysis type are required');
      }

      if (!analysisPrompts[analysisType]) {
        throw new Error(`Invalid analysis type: ${analysisType}`);
      }

      const prompt = analysisPrompts[analysisType] + '\n\n' + caseText;
      const startTime = Date.now();

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
          stopSequences: []
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      const response = await axios.post(
        `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      const processingTime = Date.now() - startTime;

      if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
        throw new Error('No response received from Gemini');
      }

      const candidate = response.data.candidates[0];
      
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Empty response from Gemini');
      }

      // Check for safety issues
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Content was blocked by Gemini safety filters');
      }

      return {
        result: candidate.content.parts[0].text.trim(),
        metadata: {
          model: model,
          processingTime: processingTime,
          provider: 'gemini',
          finishReason: candidate.finishReason,
          safetyRatings: candidate.safetyRatings || []
        }
      };

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          if (data.error?.message?.includes('API key')) {
            throw new Error('Invalid Gemini API key provided.');
          } else if (data.error?.message?.includes('quota')) {
            throw new Error('Gemini API quota exceeded. Please check your usage limits.');
          } else {
            throw new Error(`Gemini API Error: ${data.error?.message || 'Bad request'}`);
          }
        } else if (status === 403) {
          throw new Error('Access forbidden. Please check your Gemini API key permissions.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please wait before making another request.');
        } else if (status === 500) {
          throw new Error('Gemini service temporarily unavailable. Please try again later.');
        }
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The analysis took too long to complete.');
      }

      console.error('Gemini Service Error:', error);
      throw new Error(`Gemini Analysis Error: ${error.message}`);
    }
  }

  async validateApiKey() {
    try {
      const response = await axios.get(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          timeout: 10000
        }
      );
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }

  getAvailableModels() {
    return [
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Text-only input' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Text and image input' }
    ];
  }

  async listModels() {
    try {
      const response = await axios.get(
        `${this.baseUrl}?key=${this.apiKey}`
      );
      return response.data.models || [];
    } catch (error) {
      console.error('Error listing Gemini models:', error);
      return [];
    }
  }
}

module.exports = GeminiService;