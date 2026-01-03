/**
 * BibleService.js - VERSÃO SIMPLIFICADA SEM BUGS
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from './supabaseClient';

class BibleService {
  constructor() {
    this.booksCache = null;
    this.chapterCache = {};
  }

  /**
   * Buscar todos os livros
   */
  async getAllBooks() {
    try {
      // 1. Verificar cache em memória
      if (this.booksCache && this.booksCache.length > 0) {
        console.log('📚 Livros do cache em memória');
        return this.booksCache;
      }

      // 2. Verificar AsyncStorage
      const cached = await AsyncStorage.getItem('bible_books');
      if (cached) {
        console.log('📚 Livros do AsyncStorage');
        this.booksCache = JSON.parse(cached);
        return this.booksCache;
      }

      // 3. Buscar do Supabase
      console.log('📚 Buscando livros do Supabase...');
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .order('id');

      if (error) {
        console.error('❌ Erro ao buscar livros:', error);
        throw new Error(`Erro ao buscar livros: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Nenhum livro encontrado no banco');
      }

      console.log(`✅ ${data.length} livros carregados do Supabase`);

      // 4. Salvar em cache
      this.booksCache = data;
      await AsyncStorage.setItem('bible_books', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('❌ Erro em getAllBooks:', error);
      throw error;
    }
  }

  /**
   * Buscar capítulo
   */
  async getChapter(book, chapter) {
    try {
      const cacheKey = `${book}_${chapter}`;

      // 1. Verificar cache em memória
      if (this.chapterCache[cacheKey]) {
        console.log(`📖 Capítulo ${book} ${chapter} do cache em memória`);
        return this.chapterCache[cacheKey];
      }

      // 2. Verificar AsyncStorage
      const cached = await AsyncStorage.getItem(`chapter_${cacheKey}`);
      if (cached) {
        console.log(`📖 Capítulo ${book} ${chapter} do AsyncStorage`);
        const data = JSON.parse(cached);
        this.chapterCache[cacheKey] = data;
        return data;
      }

      // 3. Buscar do Supabase
      console.log(`📖 Buscando ${book} ${chapter} do Supabase...`);
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('book', book)
        .eq('chapter', chapter)
        .order('verse');

      if (error) {
        console.error('❌ Erro ao buscar capítulo:', error);
        throw new Error(`Erro ao buscar capítulo: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`Capítulo não encontrado: ${book} ${chapter}`);
      }

      console.log(`✅ ${data.length} versículos carregados`);

      // 4. Salvar em cache
      this.chapterCache[cacheKey] = data;
      await AsyncStorage.setItem(`chapter_${cacheKey}`, JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('❌ Erro em getChapter:', error);
      throw error;
    }
  }

  /**
   * Buscar versículo específico
   */
  async getVerse(book, chapter, verse) {
    try {
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar versículo:', error);
      throw error;
    }
  }

  /**
   * Pesquisar versículos
   */
  async searchVerses(searchText, limit = 50) {
    try {
      const { data, error } = await supabase
        .rpc('search_verses', {
          search_text: searchText,
          result_limit: limit
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Erro na pesquisa:', error);
      throw error;
    }
  }

  /**
   * Limpar cache
   */
  async clearCache() {
    try {
      this.booksCache = null;
      this.chapterCache = {};

      const keys = await AsyncStorage.getAllKeys();
      const bibleKeys = keys.filter(
        key => key.startsWith('chapter_') || key === 'bible_books'
      );

      if (bibleKeys.length > 0) {
        await AsyncStorage.multiRemove(bibleKeys);
      }

      console.log('🗑️ Cache limpo');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
      throw error;
    }
  }
}

// Exportar instância única
export default new BibleService();