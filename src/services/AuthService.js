import supabaseClient from '../config/supabase';

/**
 * Serviço de Autenticação usando Supabase
 */
class AuthService {
  /**
   * Verifica se usuário está logado
   */
  async isAuthenticated() {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      return session !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Obtém dados do usuário logado
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (!user) return null;

      // Buscar perfil completo do usuário
      const { data: profile, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: profile?.name || 'Usuário',
        avatar: profile?.avatar_url || null,
        createdAt: user.created_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Faz login do usuário
   */
  async login(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message === 'Invalid login credentials'
            ? 'Email ou senha incorretos'
            : 'Erro ao fazer login',
        };
      }

      // Buscar perfil
      const { data: profile } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || 'Usuário',
          avatar: profile?.avatar_url || null,
          createdAt: data.user.created_at,
        },
      };
    } catch (error) {
      console.error('Error logging in:', error);
      return {
        success: false,
        error: 'Erro ao fazer login',
      };
    }
  }

  /**
   * Registra novo usuário
   */
  async register(name, email, password) {
    try {
      // Validações
      if (!name || !email || !password) {
        return {
          success: false,
          error: 'Todos os campos são obrigatórios',
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'A senha deve ter pelo menos 6 caracteres',
        };
      }

      // Criar usuário no Supabase Auth
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return {
            success: false,
            error: 'Este email já está cadastrado',
          };
        }
        return {
          success: false,
          error: 'Erro ao criar conta',
        };
      }

      // O trigger no banco de dados criará automaticamente o perfil e stats

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: name,
          avatar: null,
          createdAt: data.user.created_at,
        },
      };
    } catch (error) {
      console.error('Error registering:', error);
      return {
        success: false,
        error: 'Erro ao criar conta',
      };
    }
  }

  /**
   * Faz logout
   */
  async logout() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        return { success: false };
      }
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false };
    }
  }

  /**
   * Atualiza dados do usuário
   */
  async updateUser(updates) {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (!user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      // Atualizar perfil na tabela user_profiles
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        return { success: false, error: 'Erro ao atualizar usuário' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: data.name,
          avatar: data.avatar_url,
          createdAt: user.created_at,
        },
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Erro ao atualizar usuário' };
    }
  }

  /**
   * Deleta conta do usuário
   */
  async deleteAccount() {
    try {
      // Nota: Supabase não tem método direto para deletar usuário via client
      // Precisaria de uma função serverless ou admin API
      // Por enquanto, vamos apenas fazer logout

      // TODO: Implementar função serverless para deletar conta
      // Por enquanto apenas deslogar
      await this.logout();

      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false };
    }
  }

  /**
   * Obtém sessão atual
   */
  async getSession() {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Listener para mudanças de autenticação
   */
  onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

export default new AuthService();
