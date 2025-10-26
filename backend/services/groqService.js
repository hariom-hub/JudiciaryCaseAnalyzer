const axios = require('axios');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.defaultModel = 'llama3-8b-8192'; // Fast and efficient model
  }

  // Generate analysis prompts based on type
  generatePrompt(caseData, analysisType) {
    const baseContext = `
Legal Case Details:
Title: ${caseData.title}
Case Number: ${caseData.caseNumber || 'Not specified'}
Case Type: ${caseData.caseType}
Court: ${caseData.court || 'Not specified'}
Parties: ${JSON.stringify(caseData.parties || {})}
Date of Filing: ${caseData.dateOfFiling || 'Not specified'}

Case Text:
${caseData.caseText}

---
`;

    const prompts = {
      summary: `${baseContext}
Please provide a comprehensive case summary including:
1. Key facts and background
2. Main legal issues involved
3. Current status and important dates
4. Parties involved and their positions

Provide a clear, concise summary in 3-4 paragraphs.`,

      legal_issues: `${baseContext}
Analyze and identify the key legal issues in this case:
1. Primary legal questions that need to be resolved
2. Areas of law involved (constitutional, criminal, civil, etc.)
3. Specific statutes, regulations, or legal principles at stake
4. Complexity level and potential precedential value

Format your response with numbered points for each major legal issue.`,

      precedents: `${baseContext}
Research and suggest relevant legal precedents for this case:
1. Similar cases that have been decided previously
2. Landmark cases in the same area of law
3. Circuit splits or conflicting decisions (if any)
4. How these precedents might influence the outcome

Provide case names, key holdings, and their relevance to this case.`,

      outcome_prediction: `${baseContext}
Based on the case details and legal analysis, predict the likely outcome:
1. Probability of success for each party
2. Potential settlement scenarios
3. Key factors that will influence the decision
4. Timeline for resolution
5. Potential appeals or further proceedings

Provide a balanced analysis with reasoning for your predictions.`
    };

    return prompts[analysisType] || prompts.summary;
  }

  // Analyze case using Groq API
  async analyzeCase(caseData, analysisType, customModel = null, customPrompt = null) {
    try {
      const startTime = Date.now();
      
      if (!this.apiKey) {
        throw new Error('Groq API key not configured');
      }

      const model = customModel || this.defaultModel;
      const prompt = customPrompt || this.generatePrompt(caseData, analysisType);

      const requestData = {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert legal analyst with deep knowledge of law, legal precedents, and case analysis. Provide thorough, accurate, and well-structured legal analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent legal analysis
        top_p: 0.9,
        stream: false
      };

      console.log(`Making Groq API request for ${analysisType} analysis...`);
      
      const response = await axios.post(`${this.baseURL}/chat/completions`, requestData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response format from Groq API');
      }

      const result = response.data.choices[0].message.content.trim();
      
      // Extract usage information
      const usage = response.data.usage || {};
      const tokensUsed = {
        prompt: usage.prompt_tokens || 0,
        completion: usage.completion_tokens || 0,
        total: usage.total_tokens || 0
      };

      console.log(`Groq analysis completed in ${processingTime}ms`);
      console.log(`Tokens used: ${tokensUsed.total} (${tokensUsed.prompt} prompt + ${tokensUsed.completion} completion)`);

      return {
        result,
        model,
        prompt,
        tokensUsed,
        processingTime,
        provider: 'groq'
      };

    } catch (error) {
      console.error('Groq API Error:', error);

      // Handle specific error types
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 401:
            throw new Error('Invalid Groq API key');
          case 429:
            throw new Error('Groq API rate limit exceeded. Please try again later.');
          case 400:
            throw new Error(`Groq API request error: ${errorData.error?.message || 'Invalid request'}`);
          case 500:
            throw new Error('Groq API server error. Please try again later.');
          default:
            throw new Error(`Groq API error (${status}): ${errorData.error?.message || 'Unknown error'}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Groq API request timeout. The request took too long to complete.');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to Groq API. Please check your internet connection.');
      } else {
        throw new Error(`Groq service error: ${error.message}`);
      }
    }
  }

  // Get available models
  getAvailableModels() {
    return [
      {
        id: 'llama3-8b-8192',
        name: 'Llama 3 8B',
        description: 'Fast and efficient for most legal analysis tasks',
        contextWindow: 8192
      },
      {
        id: 'llama3-70b-8192',
        name: 'Llama 3 70B',
        description: 'More powerful model for complex legal analysis',
        contextWindow: 8192
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Good balance of speed and capability',
        contextWindow: 32768
      },
      {
        id: 'gemma-7b-it',
        name: 'Gemma 7B',
        description: 'Efficient model for general legal tasks',
        contextWindow: 8192
      }
    ];
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        message: 'Groq API connection successful',
        modelsAvailable: response.data.data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        message: `Groq API connection failed: ${error.message}`
      };
    }
  }
}

module.exports = new GroqService();