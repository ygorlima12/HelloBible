import AsyncStorage from '@react-native-async-storage/async-storage';
import supabaseClient from '../config/supabase';

const SERMONS_STORAGE_KEY = '@HelloBible:sermons';

/**
 * Serviço para gerenciar sermões salvos com Supabase
 */
class SermonService {
  /**
   * Verifica se usuário está autenticado
   */
  async isAuthenticated() {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      return session !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém user ID do Supabase
   */
  async getUserId() {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      return user?.id;
    } catch (error) {
      return null;
    }
  }

  /**
   * Salva um sermão
   */
  async saveSermon(sermon) {
    try {
      const isAuthed = await this.isAuthenticated();

      if (isAuthed) {
        // Salvar no Supabase
        const userId = await this.getUserId();
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabaseClient
          .from('sermons')
          .insert({
            user_id: userId,
            theme: sermon.theme,
            idea: sermon.idea || null,
            content: sermon.content,
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving sermon to Supabase:', error);
          throw error;
        }

        // Cache local
        const sermons = await this.getAllSermonsLocally();
        sermons.unshift({
          id: data.id,
          theme: data.theme,
          idea: data.idea,
          content: data.content,
          createdAt: data.created_at,
        });
        await this.saveSermonsLocally(sermons);

        return {
          id: data.id,
          theme: data.theme,
          idea: data.idea,
          content: data.content,
          createdAt: data.created_at,
        };
      } else {
        // Usuário não logado - salvar localmente
        const sermons = await this.getAllSermonsLocally();
        const newSermon = {
          id: Date.now().toString(),
          ...sermon,
          createdAt: new Date().toISOString(),
        };
        sermons.unshift(newSermon);
        await this.saveSermonsLocally(sermons);
        return newSermon;
      }
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
      const isAuthed = await this.isAuthenticated();

      if (isAuthed) {
        // Buscar do Supabase
        const userId = await this.getUserId();
        if (!userId) {
          return [];
        }

        const { data, error } = await supabaseClient
          .from('sermons')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sermons from Supabase:', error);
          return await this.getAllSermonsLocally();
        }

        const sermons = data.map(s => ({
          id: s.id,
          theme: s.theme,
          idea: s.idea,
          content: s.content,
          createdAt: s.created_at,
        }));

        // Atualizar cache local
        await this.saveSermonsLocally(sermons);

        return sermons;
      } else {
        // Usuário não logado - buscar do cache
        return await this.getAllSermonsLocally();
      }
    } catch (error) {
      console.error('Error getting sermons:', error);
      return [];
    }
  }

  /**
   * Obtém sermões do cache local
   */
  async getAllSermonsLocally() {
    try {
      const data = await AsyncStorage.getItem(SERMONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sermons locally:', error);
      return [];
    }
  }

  /**
   * Salva sermões no cache local
   */
  async saveSermonsLocally(sermons) {
    try {
      await AsyncStorage.setItem(SERMONS_STORAGE_KEY, JSON.stringify(sermons));
      return true;
    } catch (error) {
      console.error('Error saving sermons locally:', error);
      return false;
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
      const isAuthed = await this.isAuthenticated();

      if (isAuthed) {
        // Deletar do Supabase
        const userId = await this.getUserId();
        if (!userId) {
          return false;
        }

        const { error } = await supabaseClient
          .from('sermons')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) {
          console.error('Error deleting sermon from Supabase:', error);
          return false;
        }

        // Atualizar cache local
        const sermons = await this.getAllSermonsLocally();
        const filtered = sermons.filter(s => s.id !== id);
        await this.saveSermonsLocally(filtered);

        return true;
      } else {
        // Usuário não logado - deletar do cache
        const sermons = await this.getAllSermonsLocally();
        const filtered = sermons.filter(s => s.id !== id);
        await this.saveSermonsLocally(filtered);
        return true;
      }
    } catch (error) {
      console.error('Error deleting sermon:', error);
      return false;
    }
  }

  /**
   * Atualiza um sermão
   */
  async updateSermon(id, updates) {
    try {
      const isAuthed = await this.isAuthenticated();

      if (isAuthed) {
        // Atualizar no Supabase
        const userId = await this.getUserId();
        if (!userId) {
          return false;
        }

        const { data, error } = await supabaseClient
          .from('sermons')
          .update({
            theme: updates.theme,
            idea: updates.idea,
            content: updates.content,
          })
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating sermon in Supabase:', error);
          return false;
        }

        // Atualizar cache local
        const sermons = await this.getAllSermonsLocally();
        const index = sermons.findIndex(s => s.id === id);
        if (index !== -1) {
          sermons[index] = {
            id: data.id,
            theme: data.theme,
            idea: data.idea,
            content: data.content,
            createdAt: data.created_at,
          };
          await this.saveSermonsLocally(sermons);
        }

        return true;
      } else {
        // Usuário não logado - atualizar cache
        const sermons = await this.getAllSermonsLocally();
        const index = sermons.findIndex(s => s.id === id);
        if (index !== -1) {
          sermons[index] = { ...sermons[index], ...updates };
          await this.saveSermonsLocally(sermons);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error updating sermon:', error);
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
