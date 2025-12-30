import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const OPENAI_API_KEY_STORAGE = '@HelloBible:openai_api_key';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Serviço para integração com OpenAI API
 */
class OpenAIService {
  /**
   * Salva a chave da API no AsyncStorage
   * @param {string} apiKey - Chave da API da OpenAI
   */
  async saveApiKey(apiKey) {
    try {
      await AsyncStorage.setItem(OPENAI_API_KEY_STORAGE, apiKey);
      return { success: true };
    } catch (error) {
      console.error('Error saving API key:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Recupera a chave da API do AsyncStorage
   * @returns {Promise<string|null>} - Chave da API ou null
   */
  async getApiKey() {
    try {
      const apiKey = await AsyncStorage.getItem(OPENAI_API_KEY_STORAGE);
      return apiKey;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  /**
   * Remove a chave da API do AsyncStorage
   */
  async removeApiKey() {
    try {
      await AsyncStorage.removeItem(OPENAI_API_KEY_STORAGE);
      return { success: true };
    } catch (error) {
      console.error('Error removing API key:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Valida se a chave da API está configurada
   * @returns {Promise<boolean>}
   */
  async hasApiKey() {
    const apiKey = await this.getApiKey();
    return apiKey !== null && apiKey.trim() !== '';
  }

  /**
   * Envia mensagem para a API da OpenAI
   * @param {Array} messages - Array de mensagens no formato OpenAI
   * @param {Object} options - Opções adicionais
   * @returns {Promise<Object>} - Resposta da API
   */
  async sendMessage(messages, options = {}) {
    try {
      const apiKey = await this.getApiKey();

      if (!apiKey) {
        throw new Error('API Key não configurada. Por favor, configure sua chave da OpenAI.');
      }

      const {
        model = 'gpt-3.5-turbo',
        temperature = 0.7,
        max_tokens = 1000,
      } = options;

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model,
          messages,
          temperature,
          max_tokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          timeout: 30000, // 30 segundos
        }
      );

      return {
        success: true,
        data: response.data,
        message: response.data.choices[0].message.content,
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);

      let errorMessage = 'Erro ao comunicar com a API da OpenAI.';

      if (error.response) {
        // Erro da API
        if (error.response.status === 401) {
          errorMessage = 'Chave de API inválida. Verifique sua chave da OpenAI.';
        } else if (error.response.status === 429) {
          errorMessage = 'Limite de requisições atingido. Tente novamente mais tarde.';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro no servidor da OpenAI. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.error?.message || errorMessage;
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Envia uma pergunta bíblica para a OpenAI com contexto teológico
   * @param {string} userMessage - Pergunta do usuário
   * @param {Array} conversationHistory - Histórico da conversa
   * @returns {Promise<Object>} - Resposta da API
   */
  async askBiblicalQuestion(userMessage, conversationHistory = []) {
    const systemPrompt = {
      role: 'system',
      content: `Você é um assistente teológico especializado em estudos bíblicos.

Suas responsabilidades:
- Responder perguntas sobre a Bíblia com precisão e profundidade
- Fornecer contexto histórico, cultural e linguístico quando relevante
- Citar versículos e referências bíblicas apropriadas
- Explicar conceitos teológicos de forma clara e acessível
- Manter uma abordagem respeitosa e equilibrada
- Ajudar na preparação de sermões e estudos bíblicos

Diretrizes:
- Sempre cite a referência bíblica (livro, capítulo e versículo)
- Seja conciso mas informativo
- Use linguagem acessível
- Mantenha o foco no contexto bíblico e teológico
- Respeite diferentes interpretações teológicas quando apropriado`,
    };

    const messages = [
      systemPrompt,
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    return await this.sendMessage(messages);
  }

  /**
   * Gera uma estrutura de sermão baseada no tema e texto bíblico
   * @param {string} theme - Tema do sermão
   * @param {string} bibleText - Texto base (referência bíblica)
   * @param {string} audience - Público-alvo
   * @returns {Promise<Object>} - Estrutura do sermão
   */
  async generateSermonStructure(theme, bibleText, audience = 'Geral') {
    const prompt = `Crie uma estrutura detalhada de sermão sobre o tema "${theme}" baseado em ${bibleText}.

Público-alvo: ${audience}

Por favor, forneça:
1. Introdução (com ilustração ou gancho)
2. Contexto histórico e cultural do texto
3. Três pontos principais de exposição
4. Aplicações práticas para cada ponto
5. Conclusão com chamado à ação
6. Sugestões de versículos de apoio

Formato: Use markdown para facilitar a leitura.`;

    return await this.sendMessage([
      {
        role: 'user',
        content: prompt,
      },
    ], {
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      max_tokens: 2000,
    });
  }

  /**
   * Analisa um versículo bíblico em profundidade
   * @param {string} verse - Versículo a ser analisado
   * @param {string} reference - Referência bíblica
   * @returns {Promise<Object>} - Análise do versículo
   */
  async analyzeVerse(verse, reference) {
    const prompt = `Faça uma análise profunda do seguinte versículo:

"${verse}" - ${reference}

Por favor, forneça:
1. Contexto histórico e cultural
2. Significado das palavras-chave no original (hebraico/grego)
3. Interpretação teológica
4. Aplicação prática para hoje
5. Versículos relacionados

Seja didático e acessível.`;

    return await this.sendMessage([
      {
        role: 'user',
        content: prompt,
      },
    ], {
      temperature: 0.7,
      max_tokens: 1500,
    });
  }

  /**
   * Testa a conexão com a API usando a chave fornecida
   * @param {string} apiKey - Chave da API para testar
   * @returns {Promise<Object>} - Resultado do teste
   */
  async testApiKey(apiKey) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Olá' }
          ],
          max_tokens: 10,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        message: 'Chave de API válida!',
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Chave de API inválida.',
        };
      }

      return {
        success: false,
        error: 'Não foi possível validar a chave. Verifique sua conexão.',
      };
    }
  }
}

// Exportar instância única (Singleton)
export default new OpenAIService();
