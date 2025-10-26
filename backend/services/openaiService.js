const OpenAI = require('openai');

const analysisPrompts = {
  summary: `Provide a concise summary of this legal case including:
- Key facts and background
- Parties involved
- Main legal issues
- Court decision (if available)
- Significance of the case

Case Text:`,

  legal_issues: `Identify and analyze the main legal issues in this case:
- Primary legal questions presented
- Areas of law involved
- Constitutional or statutory provisions
- Legal principles at stake
- Jurisdictional issues

Case Text:`,

  precedents: `Analyze relevant legal precedents for this case:
- Key precedent cases that apply
- How precedents support each party's position
- Distinguishing factors from precedent cases
- Evolution of relevant legal doctrine
- Potential impact on future cases

Case Text:`,

  outcome_prediction: `Analyze the likely outcome of this case:
- Strengths and weaknesses of each party's arguments
- Relevant precedents and their application
- Policy considerations
- Most probable outcome with reasoning
- Alternative scenarios

Case Text:`
};

class OpenAIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  async analyzeCase(caseText, analysisType, model = 'gpt-3.5-turbo') {
    try {
      if (!caseText || !analysisType) {
        throw new Error('Case text and analysis type are required');
      }

      if (!analysisPrompts[analysisType]) {
        throw new Error(`Invalid analysis type: ${analysisType}`);
      }

      const prompt = analysisPrompts[analysisType] + '\n\n' + caseText;
      const startTime = Date.now();

      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert legal analyst with extensive knowledge of case law, statutory interpretation, and judicial reasoning. Provide thorough, accurate, and professionally formatted legal analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      const processingTime = Date.now() - startTime;

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response received from OpenAI');
      }

      return {
        result: response.choices[0].message.content.trim(),
        metadata: {
          model: model,
          tokensUsed: response.usage?.total_tokens || 0,
          processingTime: processingTime,
          provider: 'openai'
        }
      };

    } catch (error) {
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing settings.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key provided.');
      } else if (error.code === 'model_not_found') {
        throw new Error(`OpenAI model '${model}' not found or not accessible.`);
      } else if (error.code === 'context_length_exceeded') {
        throw new Error('Case text is too long. Please shorten the text and try again.');
      }
      
      console.error('OpenAI Service Error:', error);
      throw new Error(`OpenAI Analysis Error: ${error.message}`);
    }
  }

  async validateApiKey() {
    try {
      await this.openai.models.list();
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error.message 
      };
    }
  }

  getAvailableModels() {
    return [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
      { id: 'gpt-4', name: 'GPT-4', description: 'More capable, slower' },
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Latest GPT-4 model' }
    ];
  }
}

module.exports = OpenAIService;