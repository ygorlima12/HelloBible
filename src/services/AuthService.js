import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@HelloBible:auth';
const USER_STORAGE_KEY = '@HelloBible:user';

/**
 * Serviço de Autenticação
 */
class AuthService {
  /**
   * Verifica se usuário está logado
   */
  async isAuthenticated() {
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return authData !== null;
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
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
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
      // Buscar usuário salvo
      const users = await this.getAllUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return {
          success: false,
          error: 'Email ou senha incorretos',
        };
      }

      // Salvar sessão
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        userId: user.id,
        email: user.email,
        loginAt: new Date().toISOString(),
      }));

      // Salvar dados do usuário atual
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      return {
        success: true,
        user,
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

      // Verificar se email já existe
      const users = await this.getAllUsers();
      if (users.find(u => u.email === email)) {
        return {
          success: false,
          error: 'Este email já está cadastrado',
        };
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Em produção, usar hash!
        createdAt: new Date().toISOString(),
        avatar: null,
      };

      // Salvar usuário
      users.push(newUser);
      await AsyncStorage.setItem('@HelloBible:users', JSON.stringify(users));

      // Fazer login automático
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        loginAt: new Date().toISOString(),
      }));

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

      return {
        success: true,
        user: newUser,
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
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
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
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const updatedUser = { ...currentUser, ...updates };

      // Atualizar na lista de usuários
      const users = await this.getAllUsers();
      const index = users.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        await AsyncStorage.setItem('@HelloBible:users', JSON.stringify(users));
      }

      // Atualizar usuário atual
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Erro ao atualizar usuário' };
    }
  }

  /**
   * Obtém todos os usuários (privado)
   */
  async getAllUsers() {
    try {
      const users = await AsyncStorage.getItem('@HelloBible:users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  /**
   * Deleta conta do usuário
   */
  async deleteAccount() {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return { success: false };
      }

      // Remover da lista de usuários
      const users = await this.getAllUsers();
      const filtered = users.filter(u => u.id !== currentUser.id);
      await AsyncStorage.setItem('@HelloBible:users', JSON.stringify(filtered));

      // Fazer logout
      await this.logout();

      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false };
    }
  }
}

export default new AuthService();
