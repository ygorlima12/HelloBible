import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento
const KEYS = {
  TOTAL_XP: '@HelloBible:totalXP',
  FAVORITES: '@HelloBible:favorites',
  COMPLETED: '@HelloBible:completed',
};

// ============ XP ============
export const getTotalXP = async () => {
  try {
    const xp = await AsyncStorage.getItem(KEYS.TOTAL_XP);
    return xp ? parseInt(xp) : 0;
  } catch (error) {
    console.error('Erro ao carregar XP:', error);
    return 0;
  }
};

export const addXP = async (points) => {
  try {
    const currentXP = await getTotalXP();
    const newXP = currentXP + points;
    await AsyncStorage.setItem(KEYS.TOTAL_XP, newXP.toString());
    return newXP;
  } catch (error) {
    console.error('Erro ao adicionar XP:', error);
    return 0;
  }
};

// ============ FAVORITOS ============
export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
};

export const toggleFavorite = async (verseId) => {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(verseId);
    
    let newFavorites;
    if (isFavorite) {
      // Remover
      newFavorites = favorites.filter(id => id !== verseId);
    } else {
      // Adicionar
      newFavorites = [...favorites, verseId];
    }
    
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(newFavorites));
    return !isFavorite; // Retorna novo estado
  } catch (error) {
    console.error('Erro ao favoritar:', error);
    return false;
  }
};

export const isFavorite = async (verseId) => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(verseId);
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return false;
  }
};

// ============ COMPLETADOS ============
export const getCompleted = async () => {
  try {
    const completed = await AsyncStorage.getItem(KEYS.COMPLETED);
    return completed ? JSON.parse(completed) : [];
  } catch (error) {
    console.error('Erro ao carregar completados:', error);
    return [];
  }
};

export const markAsCompleted = async (verseId) => {
  try {
    const completed = await getCompleted();
    if (!completed.includes(verseId)) {
      const newCompleted = [...completed, verseId];
      await AsyncStorage.setItem(KEYS.COMPLETED, JSON.stringify(newCompleted));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao marcar como completado:', error);
    return false;
  }
};

export const isCompleted = async (verseId) => {
  try {
    const completed = await getCompleted();
    return completed.includes(verseId);
  } catch (error) {
    console.error('Erro ao verificar completado:', error);
    return false;
  }
};

// ============ LIMPAR DADOS (útil para testes) ============
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.TOTAL_XP, KEYS.FAVORITES, KEYS.COMPLETED]);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};