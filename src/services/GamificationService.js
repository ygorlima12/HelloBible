import AsyncStorage from '@react-native-async-storage/async-storage';
import supabaseClient from '../config/supabase';

const XP_STORAGE_KEY = '@HelloBible:gamification';
const STREAK_STORAGE_KEY = '@HelloBible:streak';

/**
 * Sistema de Gamificação com Supabase
 * XP, Níveis, Badges, Streaks
 */

// Configuração de níveis (XP necessário para cada nível)
const LEVEL_CONFIG = [
  { level: 1, xpRequired: 0, title: 'Iniciante' },
  { level: 2, xpRequired: 100, title: 'Estudante' },
  { level: 3, xpRequired: 250, title: 'Aprendiz' },
  { level: 4, xpRequired: 500, title: 'Dedicado' },
  { level: 5, xpRequired: 1000, title: 'Sábio' },
  { level: 6, xpRequired: 2000, title: 'Mestre' },
  { level: 7, xpRequired: 3500, title: 'Expert' },
  { level: 8, xpRequired: 5500, title: 'Guardião' },
  { level: 9, xpRequired: 8000, title: 'Iluminado' },
  { level: 10, xpRequired: 12000, title: 'Lendário' },
];

// Badges/Conquistas disponíveis
const ACHIEVEMENTS = {
  firstLesson: {
    id: 'firstLesson',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira lição',
    icon: 'star',
    xp: 50,
    color: ['#eab308', '#f59e0b'],
  },
  streak3: {
    id: 'streak3',
    title: 'Consistente',
    description: 'Estude por 3 dias seguidos',
    icon: 'fire',
    xp: 100,
    color: ['#f97316', '#ef4444'],
  },
  streak7: {
    id: 'streak7',
    title: 'Dedicado',
    description: 'Estude por 7 dias seguidos',
    icon: 'fire',
    xp: 200,
    color: ['#f97316', '#ef4444'],
  },
  streak30: {
    id: 'streak30',
    title: 'Imparável',
    description: 'Estude por 30 dias seguidos',
    icon: 'fire',
    xp: 500,
    color: ['#f97316', '#ef4444'],
  },
  module1Complete: {
    id: 'module1Complete',
    title: 'Fundamentos Sólidos',
    description: 'Complete o módulo de Fundamentos',
    icon: 'trophy',
    xp: 150,
    color: ['#3b82f6', '#06b6d4'],
  },
  allPerfect: {
    id: 'allPerfect',
    title: 'Perfeccionista',
    description: 'Acerte todas as questões de uma lição',
    icon: 'crown',
    xp: 100,
    color: ['#a855f7', '#d946ef'],
  },
  speedRunner: {
    id: 'speedRunner',
    title: 'Veloz',
    description: 'Complete 3 lições em um dia',
    icon: 'lightning-bolt',
    xp: 150,
    color: ['#eab308', '#facc15'],
  },
  scholar: {
    id: 'scholar',
    title: 'Estudioso',
    description: 'Complete 10 lições',
    icon: 'school',
    xp: 200,
    color: ['#10b981', '#14b8a6'],
  },
  master: {
    id: 'master',
    title: 'Mestre do Conhecimento',
    description: 'Complete todos os módulos',
    icon: 'trophy-variant',
    xp: 1000,
    color: ['#9333ea', '#7c3aed'],
  },
};

class GamificationService {
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
   * Inicializa dados de gamificação
   */
  async initialize() {
    const isAuthed = await this.isAuthenticated();

    if (isAuthed) {
      // Usuário logado - sincronizar com Supabase
      const userId = await this.getUserId();
      if (!userId) return this.getDefaultData();

      try {
        // Buscar stats do Supabase
        const { data: stats, error } = await supabaseClient
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching stats:', error);
          return this.getDefaultData();
        }

        // Buscar conquistas
        const { data: achievements } = await supabaseClient
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', userId);

        const achievementIds = achievements?.map(a => a.achievement_id) || [];

        const data = {
          initialized: true,
          xp: stats.total_xp || 0,
          level: stats.level || 1,
          achievements: achievementIds,
          lessonsCompleted: stats.lessons_completed || 0,
          dailyLessons: 0, // Calculado localmente
          lastStudyDate: stats.last_activity_date,
          streak: stats.current_streak || 0,
          longestStreak: stats.longest_streak || 0,
          quizScores: [],
        };

        // Salvar cache local
        await this.saveDataLocally(data);
        return data;
      } catch (error) {
        console.error('Error initializing from Supabase:', error);
        return this.getDataLocally();
      }
    } else {
      // Usuário não logado - usar AsyncStorage
      const data = await this.getDataLocally();
      if (!data.initialized) {
        const initialData = this.getDefaultData();
        await this.saveDataLocally(initialData);
        return initialData;
      }
      return data;
    }
  }

  /**
   * Dados padrão
   */
  getDefaultData() {
    return {
      initialized: true,
      xp: 0,
      level: 1,
      achievements: [],
      lessonsCompleted: 0,
      dailyLessons: 0,
      lastStudyDate: null,
      streak: 0,
      longestStreak: 0,
      quizScores: [],
    };
  }

  /**
   * Obtém dados localmente (cache)
   */
  async getDataLocally() {
    try {
      const data = await AsyncStorage.getItem(XP_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting local data:', error);
      return {};
    }
  }

  /**
   * Salva dados localmente (cache)
   */
  async saveDataLocally(data) {
    try {
      await AsyncStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving local data:', error);
      return false;
    }
  }

  /**
   * Sincroniza dados com Supabase
   */
  async syncWithSupabase(data) {
    const userId = await this.getUserId();
    if (!userId) return false;

    try {
      // Atualizar stats
      const { error: statsError } = await supabaseClient
        .from('user_stats')
        .upsert(
          {
            user_id: userId,
            total_xp: data.xp || 0,
            level: data.level || 1,
            lessons_completed: data.lessonsCompleted || 0,
            current_streak: data.streak || 0,
            longest_streak: data.longestStreak || 0,
            last_activity_date: new Date().toISOString().split('T')[0],
          },
          {
            onConflict: 'user_id', // Especifica a coluna de conflito para merge
          }
        );

      if (statsError) {
        console.error('Error syncing stats:', statsError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      return false;
    }
  }

  /**
   * Obtém dados (público)
   */
  async getData() {
    return await this.initialize();
  }

  /**
   * Salva dados (público)
   */
  async saveData(data) {
    // Salvar localmente
    await this.saveDataLocally(data);

    // Sincronizar com Supabase se autenticado
    const isAuthed = await this.isAuthenticated();
    if (isAuthed) {
      await this.syncWithSupabase(data);
    }

    return true;
  }

  /**
   * Adiciona XP
   */
  async addXP(amount, reason = '') {
    const data = await this.getData();
    const oldXP = data.xp || 0;
    const newXP = oldXP + amount;

    // Verificar se subiu de nível
    const oldLevel = this.getLevelFromXP(oldXP);
    const newLevel = this.getLevelFromXP(newXP);
    const leveledUp = newLevel > oldLevel;

    data.xp = newXP;
    data.level = newLevel;

    await this.saveData(data);

    return {
      xpGained: amount,
      totalXP: newXP,
      leveledUp,
      newLevel,
      reason,
    };
  }

  /**
   * Calcula nível baseado em XP
   */
  getLevelFromXP(xp) {
    for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_CONFIG[i].xpRequired) {
        return LEVEL_CONFIG[i].level;
      }
    }
    return 1;
  }

  /**
   * Obtém informações do nível atual
   */
  async getLevelInfo() {
    const data = await this.getData();
    const currentXP = data.xp || 0;
    const currentLevel = data.level || 1;

    const currentLevelConfig = LEVEL_CONFIG.find(l => l.level === currentLevel);
    const nextLevelConfig = LEVEL_CONFIG.find(l => l.level === currentLevel + 1);

    const xpForCurrentLevel = currentLevelConfig?.xpRequired || 0;
    const xpForNextLevel = nextLevelConfig?.xpRequired || 0;
    const xpProgress = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const progress = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 100;

    return {
      currentLevel,
      currentXP,
      xpForNextLevel,
      xpNeeded,
      progress: Math.min(progress, 100),
      title: currentLevelConfig?.title || 'Iniciante',
      isMaxLevel: currentLevel >= LEVEL_CONFIG.length,
    };
  }

  /**
   * Completa uma lição
   */
  async completeLesson(quizScore = 0) {
    const data = await this.getData();

    // Incrementar contadores
    data.lessonsCompleted = (data.lessonsCompleted || 0) + 1;
    data.dailyLessons = (data.dailyLessons || 0) + 1;

    // Atualizar streak
    const today = new Date().toDateString();
    const lastStudy = data.lastStudyDate ? new Date(data.lastStudyDate).toDateString() : null;

    if (lastStudy !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastStudy === yesterdayStr) {
        data.streak = (data.streak || 0) + 1;
      } else {
        data.streak = 1;
      }

      data.longestStreak = Math.max(data.longestStreak || 0, data.streak);
      data.lastStudyDate = today;
      data.dailyLessons = 1;
    }

    // Salvar pontuação
    data.quizScores = data.quizScores || [];
    data.quizScores.push({
      score: quizScore,
      date: new Date().toISOString(),
    });

    // XP base
    let xpEarned = 50;

    // Bônus de pontuação perfeita
    if (quizScore === 100) {
      xpEarned += 25;
    }

    // Bônus de streak
    if (data.streak >= 7) {
      xpEarned += 15;
    } else if (data.streak >= 3) {
      xpEarned += 10;
    }

    await this.saveData(data);

    // Adicionar XP
    const xpResult = await this.addXP(xpEarned, 'Lição completa');

    // Verificar conquistas
    const newAchievements = await this.checkAchievements(data);

    return {
      ...xpResult,
      newAchievements,
      streak: data.streak,
    };
  }

  /**
   * Verifica e desbloqueia conquistas
   */
  async checkAchievements(data) {
    const newAchievements = [];
    const currentAchievements = data.achievements || [];

    // Primeira lição
    if (data.lessonsCompleted >= 1 && !currentAchievements.includes('firstLesson')) {
      newAchievements.push('firstLesson');
    }

    // Streaks
    if (data.streak >= 30 && !currentAchievements.includes('streak30')) {
      newAchievements.push('streak30');
    } else if (data.streak >= 7 && !currentAchievements.includes('streak7')) {
      newAchievements.push('streak7');
    } else if (data.streak >= 3 && !currentAchievements.includes('streak3')) {
      newAchievements.push('streak3');
    }

    // Estudioso
    if (data.lessonsCompleted >= 10 && !currentAchievements.includes('scholar')) {
      newAchievements.push('scholar');
    }

    // Veloz (3 lições em um dia)
    if (data.dailyLessons >= 3 && !currentAchievements.includes('speedRunner')) {
      newAchievements.push('speedRunner');
    }

    // Desbloquear novas conquistas
    if (newAchievements.length > 0) {
      data.achievements = [...currentAchievements, ...newAchievements];
      await this.saveData(data);

      // Sincronizar conquistas com Supabase
      const userId = await this.getUserId();
      if (userId) {
        for (const achievementId of newAchievements) {
          await supabaseClient
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievementId,
            })
            .select();
        }
      }

      // Adicionar XP das conquistas
      for (const achievementId of newAchievements) {
        const achievement = ACHIEVEMENTS[achievementId];
        if (achievement?.xp) {
          await this.addXP(achievement.xp, `Conquista: ${achievement.title}`);
        }
      }
    }

    return newAchievements.map(id => ({
      ...ACHIEVEMENTS[id],
      unlocked: true,
    }));
  }

  /**
   * Obtém todas as conquistas
   */
  async getAllAchievements() {
    const data = await this.getData();
    const unlockedIds = data.achievements || [];

    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
    }));
  }

  /**
   * Obtém estatísticas
   */
  async getStats() {
    const data = await this.getData();
    const levelInfo = await this.getLevelInfo();

    return {
      totalXP: data.xp || 0,
      level: data.level || 1,
      levelTitle: levelInfo.title,
      levelProgress: levelInfo.progress,
      lessonsCompleted: data.lessonsCompleted || 0,
      streak: data.streak || 0,
      longestStreak: data.longestStreak || 0,
      achievements: (data.achievements || []).length,
      lastActivityDate: data.lastStudyDate,
      dailyLessons: data.dailyLessons || 0,
    };
  }

  /**
   * Reseta dados (dev only)
   */
  async reset() {
    await AsyncStorage.removeItem(XP_STORAGE_KEY);
    await AsyncStorage.removeItem(STREAK_STORAGE_KEY);
    return this.initialize();
  }
}

export default new GamificationService();
