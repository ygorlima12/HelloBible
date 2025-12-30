import axios from 'axios';

// ⚠️ SUBSTITUA PELA SUA API KEY DA OPENAI
const OPENAI_API_KEY = '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';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class AIService {
  async sendMessage(userMessage, conversationHistory = []) {
    try {
      // Montar histórico de mensagens no formato da OpenAI
      const messages = [
        {
          role: 'system',
          content: 'Você é um assistente especializado em estudos bíblicos. Ajude as pessoas a entenderem melhor a Bíblia com respostas claras, educativas e inspiradoras. Seja amigável e encorajador. Responda de forma concisa (máximo 3 parágrafos).',
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage,
        },
      ];

      console.log('=== Enviando mensagem para OpenAI ===');

      // Fazer chamada para API da OpenAI
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4o-mini', // Modelo mais barato e rápido
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      console.log('=== Resposta recebida ===');

      // Extrair resposta da IA
      const aiMessage = response.data.choices[0].message.content;

      return {
        success: true,
        message: aiMessage,
      };
    } catch (error) {
      console.error('Erro ao chamar API da OpenAI:', error.response?.data || error.message);
      
      let errorMessage = 'Desculpe, não consegui processar sua mensagem. Tente novamente.';
      
      if (error.response?.status === 401) {
        errorMessage = '🔑 Erro: API Key inválida. Verifique sua chave!';
      } else if (error.response?.status === 429) {
        errorMessage = '⏸️ Limite de requisições atingido. Aguarde um momento.';
      } else if (error.response?.status === 500) {
        errorMessage = '🔧 Servidor da OpenAI temporariamente indisponível.';
      }

      return {
        success: false,
        message: errorMessage,
        error: error.message,
      };
    }
  }

  // Sugestões de perguntas
  getSuggestions() {
    return [
      'O que significa João 3:16?',
      'Como posso orar melhor?',
      'Explique o Salmo 23',
      'Qual a mensagem principal da Bíblia?',
      'Como aplicar Provérbios no dia a dia?',
    ];
  }
}

export default new AIService();