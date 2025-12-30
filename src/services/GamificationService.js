import AsyncStorage from '@react-native-async-storage/async-storage';

const XP_STORAGE_KEY = '@HelloBible:gamification';
const STREAK_STORAGE_KEY = '@HelloBible:streak';

/**
 * Sistema de Gamificação
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
   * Inicializa dados de gamificação
   */
  async initialize() {
    const data = await this.getData();
    if (!data.initialized) {
      const initialData = {
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
      await this.saveData(initialData);
      return initialData;
    }
    return data;
  }

  /**
   * Obtém dados de gamificação
   */
  async getData() {
    try {
      const data = await AsyncStorage.getItem(XP_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting gamification data:', error);
      return {};
    }
  }

  /**
   * Salva dados de gamificação
   */
  async saveData(data) {
    try {
      await AsyncStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving gamification data:', error);
      return false;
    }
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

    if (!nextLevelConfig) {
      return {
        level: currentLevel,
        title: currentLevelConfig.title,
        currentXP,
        xpForCurrentLevel: currentLevelConfig.xpRequired,
        xpForNextLevel: null,
        progress: 1,
        isMaxLevel: true,
      };
    }

    const xpForCurrentLevel = currentLevelConfig.xpRequired;
    const xpForNextLevel = nextLevelConfig.xpRequired;
    const xpInLevel = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const progress = xpInLevel / xpNeeded;

    return {
      level: currentLevel,
      title: currentLevelConfig.title,
      currentXP,
      xpForCurrentLevel,
      xpForNextLevel,
      xpInLevel,
      xpNeeded,
      progress,
      isMaxLevel: false,
    };
  }

  /**
   * Completa uma lição
   */
  async completeLesson(quizScore = 0) {
    const data = await this.getData();

    // XP base por lição
    let xpGained = 50;

    // Bonus por quiz perfeito
    if (quizScore === 100) {
      xpGained += 25;
    } else if (quizScore >= 80) {
      xpGained += 15;
    }

    // Atualizar contadores
    data.lessonsCompleted = (data.lessonsCompleted || 0) + 1;
    data.dailyLessons = (data.dailyLessons || 0) + 1;

    // Atualizar streak
    const today = new Date().toDateString();
    if (data.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (data.lastStudyDate === yesterday.toDateString()) {
        data.streak = (data.streak || 0) + 1;
      } else if (!data.lastStudyDate) {
        data.streak = 1;
      } else {
        data.streak = 1; // Reset streak
      }

      data.lastStudyDate = today;
      data.dailyLessons = 1;

      if (data.streak > (data.longestStreak || 0)) {
        data.longestStreak = data.streak;
      }
    }

    // Salvar quiz score
    if (!data.quizScores) data.quizScores = [];
    data.quizScores.push(quizScore);

    await this.saveData(data);

    // Adicionar XP
    const xpResult = await this.addXP(xpGained, 'Lição completa');

    // Verificar conquistas
    const newAchievements = await this.checkAchievements(data);

    return {
      ...xpResult,
      newAchievements,
      streak: data.streak,
      dailyLessons: data.dailyLessons,
    };
  }

  /**
   * Verifica e desbloqueia conquistas
   */
  async checkAchievements(data) {
    const unlockedAchievements = data.achievements || [];
    const newAchievements = [];

    // Primeira lição
    if (data.lessonsCompleted === 1 && !unlockedAchievements.includes('firstLesson')) {
      newAchievements.push(ACHIEVEMENTS.firstLesson);
      unlockedAchievements.push('firstLesson');
      await this.addXP(ACHIEVEMENTS.firstLesson.xp, 'Conquista: Primeiro Passo');
    }

    // Streaks
    if (data.streak >= 3 && !unlockedAchievements.includes('streak3')) {
      newAchievements.push(ACHIEVEMENTS.streak3);
      unlockedAchievements.push('streak3');
      await this.addXP(ACHIEVEMENTS.streak3.xp, 'Conquista: Consistente');
    }

    if (data.streak >= 7 && !unlockedAchievements.includes('streak7')) {
      newAchievements.push(ACHIEVEMENTS.streak7);
      unlockedAchievements.push('streak7');
      await this.addXP(ACHIEVEMENTS.streak7.xp, 'Conquista: Dedicado');
    }

    if (data.streak >= 30 && !unlockedAchievements.includes('streak30')) {
      newAchievements.push(ACHIEVEMENTS.streak30);
      unlockedAchievements.push('streak30');
      await this.addXP(ACHIEVEMENTS.streak30.xp, 'Conquista: Imparável');
    }

    // 10 lições
    if (data.lessonsCompleted >= 10 && !unlockedAchievements.includes('scholar')) {
      newAchievements.push(ACHIEVEMENTS.scholar);
      unlockedAchievements.push('scholar');
      await this.addXP(ACHIEVEMENTS.scholar.xp, 'Conquista: Estudioso');
    }

    // 3 lições em um dia
    if (data.dailyLessons >= 3 && !unlockedAchievements.includes('speedRunner')) {
      newAchievements.push(ACHIEVEMENTS.speedRunner);
      unlockedAchievements.push('speedRunner');
      await this.addXP(ACHIEVEMENTS.speedRunner.xp, 'Conquista: Veloz');
    }

    // Quiz perfeito
    const lastQuiz = data.quizScores?.[data.quizScores.length - 1];
    if (lastQuiz === 100 && !unlockedAchievements.includes('allPerfect')) {
      newAchievements.push(ACHIEVEMENTS.allPerfect);
      unlockedAchievements.push('allPerfect');
      await this.addXP(ACHIEVEMENTS.allPerfect.xp, 'Conquista: Perfeccionista');
    }

    if (newAchievements.length > 0) {
      data.achievements = unlockedAchievements;
      await this.saveData(data);
    }

    return newAchievements;
  }

  /**
   * Obtém todas as conquistas com status
   */
  async getAllAchievements() {
    const data = await this.getData();
    const unlocked = data.achievements || [];

    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: unlocked.includes(achievement.id),
    }));
  }

  /**
   * Obtém estatísticas
   */
  async getStats() {
    const data = await this.getData();
    const levelInfo = await this.getLevelInfo();

    return {
      ...levelInfo,
      totalXP: data.xp || 0,
      lessonsCompleted: data.lessonsCompleted || 0,
      streak: data.streak || 0,
      longestStreak: data.longestStreak || 0,
      achievementsUnlocked: (data.achievements || []).length,
      totalAchievements: Object.keys(ACHIEVEMENTS).length,
      averageQuizScore: data.quizScores?.length > 0
        ? Math.round(data.quizScores.reduce((a, b) => a + b, 0) / data.quizScores.length)
        : 0,
    };
  }

  /**
   * Reset (para testes)
   */
  async reset() {
    await AsyncStorage.removeItem(XP_STORAGE_KEY);
    return this.initialize();
  }
}

export default new GamificationService();
export { ACHIEVEMENTS, LEVEL_CONFIG };
