/**
 * Serviço para gerenciar destaques de versículos
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGHLIGHTS_KEY = '@bible_highlights';

// Cores disponíveis para destacar
export const HIGHLIGHT_COLORS = {
  yellow: { name: 'Amarelo', color: '#FEF3C7', textColor: '#92400E' },
  green: { name: 'Verde', color: '#D1FAE5', textColor: '#065F46' },
  blue: { name: 'Azul', color: '#DBEAFE', textColor: '#1E40AF' },
  pink: { name: 'Rosa', color: '#FCE7F3', textColor: '#9F1239' },
  purple: { name: 'Roxo', color: '#E9D5FF', textColor: '#6B21A8' },
  orange: { name: 'Laranja', color: '#FED7AA', textColor: '#9A3412' },
};

class HighlightsService {
  constructor() {
    this.highlights = {};
    this.loaded = false;
  }

  /**
   * Carrega os destaques do AsyncStorage
   */
  async loadHighlights() {
    try {
      const data = await AsyncStorage.getItem(HIGHLIGHTS_KEY);
      if (data) {
        this.highlights = JSON.parse(data);
      }
      this.loaded = true;
      return this.highlights;
    } catch (error) {
      console.error('Error loading highlights:', error);
      return {};
    }
  }

  /**
   * Salva os destaques no AsyncStorage
   */
  async saveHighlights() {
    try {
      await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(this.highlights));
    } catch (error) {
      console.error('Error saving highlights:', error);
    }
  }

  /**
   * Obtém a chave única para um versículo
   */
  getVerseKey(bookAbbrev, chapter, verse) {
    return `${bookAbbrev}_${chapter}_${verse}`;
  }

  /**
   * Adiciona um destaque a um versículo
   */
  async addHighlight(bookAbbrev, chapter, verse, color = 'yellow', note = '') {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    const key = this.getVerseKey(bookAbbrev, chapter, verse);
    this.highlights[key] = {
      bookAbbrev,
      chapter,
      verse,
      color,
      note,
      createdAt: new Date().toISOString(),
    };

    await this.saveHighlights();
    return this.highlights[key];
  }

  /**
   * Remove um destaque
   */
  async removeHighlight(bookAbbrev, chapter, verse) {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    const key = this.getVerseKey(bookAbbrev, chapter, verse);
    delete this.highlights[key];

    await this.saveHighlights();
  }

  /**
   * Obtém o destaque de um versículo
   */
  async getHighlight(bookAbbrev, chapter, verse) {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    const key = this.getVerseKey(bookAbbrev, chapter, verse);
    return this.highlights[key] || null;
  }

  /**
   * Verifica se um versículo está destacado
   */
  async isHighlighted(bookAbbrev, chapter, verse) {
    const highlight = await this.getHighlight(bookAbbrev, chapter, verse);
    return !!highlight;
  }

  /**
   * Obtém todos os destaques
   */
  async getAllHighlights() {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    return Object.values(this.highlights);
  }

  /**
   * Obtém destaques de um livro
   */
  async getBookHighlights(bookAbbrev) {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    return Object.values(this.highlights).filter(h => h.bookAbbrev === bookAbbrev);
  }

  /**
   * Atualiza a nota de um destaque
   */
  async updateNote(bookAbbrev, chapter, verse, note) {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    const key = this.getVerseKey(bookAbbrev, chapter, verse);
    if (this.highlights[key]) {
      this.highlights[key].note = note;
      this.highlights[key].updatedAt = new Date().toISOString();
      await this.saveHighlights();
    }
  }

  /**
   * Atualiza a cor de um destaque
   */
  async updateColor(bookAbbrev, chapter, verse, color) {
    if (!this.loaded) {
      await this.loadHighlights();
    }

    const key = this.getVerseKey(bookAbbrev, chapter, verse);
    if (this.highlights[key]) {
      this.highlights[key].color = color;
      this.highlights[key].updatedAt = new Date().toISOString();
      await this.saveHighlights();
    }
  }
}

export default new HighlightsService();
