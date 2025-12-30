import AsyncStorage from '@react-native-async-storage/async-storage';

const SERMONS_STORAGE_KEY = '@HelloBible:sermons';

/**
 * Serviço para gerenciar sermões salvos
 */
class SermonService {
  /**
   * Salva um sermão
   */
  async saveSermon(sermon) {
    try {
      const sermons = await this.getAllSermons();
      const newSermon = {
        id: Date.now().toString(),
        ...sermon,
        createdAt: new Date().toISOString(),
      };
      sermons.unshift(newSermon); // Adiciona no início
      await AsyncStorage.setItem(SERMONS_STORAGE_KEY, JSON.stringify(sermons));
      return newSermon;
    } catch (error) {
      console.error('Error saving sermon:', error);
      throw error;
    }
  }

  /**
   * Obtém todos os sermões
   */
  async getAllSermons() {
    try {
      const data = await AsyncStorage.getItem(SERMONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sermons:', error);
      return [];
    }
  }

  /**
   * Obtém um sermão por ID
   */
  async getSermonById(id) {
    try {
      const sermons = await this.getAllSermons();
      return sermons.find(s => s.id === id);
    } catch (error) {
      console.error('Error getting sermon:', error);
      return null;
    }
  }

  /**
   * Deleta um sermão
   */
  async deleteSermon(id) {
    try {
      const sermons = await this.getAllSermons();
      const filtered = sermons.filter(s => s.id !== id);
      await AsyncStorage.setItem(SERMONS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting sermon:', error);
      return false;
    }
  }

  /**
   * Formata o conteúdo do sermão para exibição
   */
  parseSermonContent(content) {
    // Divide o conteúdo em seções
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { type: 'text', content: [] };

    for (let line of lines) {
      line = line.trim();

      if (!line) continue;

      // Detectar títulos (linhas que terminam com : ou começam com **)
      if (line.endsWith(':') || (line.startsWith('**') && line.endsWith('**'))) {
        // Salvar seção anterior
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
        }
        // Nova seção
        const title = line.replace(/\*\*/g, '').replace(/:$/, '');
        currentSection = { type: 'title', content: title };
        sections.push({ ...currentSection });
        currentSection = { type: 'text', content: [] };
      }
      // Detectar listas (começam com número. ou -)
      else if (/^\d+\./.test(line) || line.startsWith('-')) {
        if (currentSection.type !== 'list') {
          if (currentSection.content.length > 0) {
            sections.push({ ...currentSection });
          }
          currentSection = { type: 'list', content: [] };
        }
        const text = line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '');
        currentSection.content.push(text);
      }
      // Texto normal
      else {
        if (currentSection.type === 'list' && currentSection.content.length > 0) {
          sections.push({ ...currentSection });
          currentSection = { type: 'text', content: [] };
        }
        currentSection.content.push(line);
      }
    }

    // Adicionar última seção
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  }
}

export default new SermonService();
