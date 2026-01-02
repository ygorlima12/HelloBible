/**
 * Serviço para leitura da Bíblia
 * API: A Bíblia Digital (https://www.abibliadigital.com.br/api)
 *
 * IMPORTANTE: API tem limite de 20 requisições/hora sem token
 * Para uso ilimitado, obtenha um token grátis em: https://www.abibliadigital.com.br
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Lista completa de livros da Bíblia
const BIBLE_BOOKS = [
  // Antigo Testamento
  { abbrev: 'gn', name: 'Gênesis', testament: 'VT', chapters: 50 },
  { abbrev: 'ex', name: 'Êxodo', testament: 'VT', chapters: 40 },
  { abbrev: 'lv', name: 'Levítico', testament: 'VT', chapters: 27 },
  { abbrev: 'nm', name: 'Números', testament: 'VT', chapters: 36 },
  { abbrev: 'dt', name: 'Deuteronômio', testament: 'VT', chapters: 34 },
  { abbrev: 'js', name: 'Josué', testament: 'VT', chapters: 24 },
  { abbrev: 'jz', name: 'Juízes', testament: 'VT', chapters: 21 },
  { abbrev: 'rt', name: 'Rute', testament: 'VT', chapters: 4 },
  { abbrev: '1sm', name: '1 Samuel', testament: 'VT', chapters: 31 },
  { abbrev: '2sm', name: '2 Samuel', testament: 'VT', chapters: 24 },
  { abbrev: '1rs', name: '1 Reis', testament: 'VT', chapters: 22 },
  { abbrev: '2rs', name: '2 Reis', testament: 'VT', chapters: 25 },
  { abbrev: '1cr', name: '1 Crônicas', testament: 'VT', chapters: 29 },
  { abbrev: '2cr', name: '2 Crônicas', testament: 'VT', chapters: 36 },
  { abbrev: 'ed', name: 'Esdras', testament: 'VT', chapters: 10 },
  { abbrev: 'ne', name: 'Neemias', testament: 'VT', chapters: 13 },
  { abbrev: 'et', name: 'Ester', testament: 'VT', chapters: 10 },
  { abbrev: 'job', name: 'Jó', testament: 'VT', chapters: 42 },
  { abbrev: 'sl', name: 'Salmos', testament: 'VT', chapters: 150 },
  { abbrev: 'pv', name: 'Provérbios', testament: 'VT', chapters: 31 },
  { abbrev: 'ec', name: 'Eclesiastes', testament: 'VT', chapters: 12 },
  { abbrev: 'ct', name: 'Cânticos', testament: 'VT', chapters: 8 },
  { abbrev: 'is', name: 'Isaías', testament: 'VT', chapters: 66 },
  { abbrev: 'jr', name: 'Jeremias', testament: 'VT', chapters: 52 },
  { abbrev: 'lm', name: 'Lamentações', testament: 'VT', chapters: 5 },
  { abbrev: 'ez', name: 'Ezequiel', testament: 'VT', chapters: 48 },
  { abbrev: 'dn', name: 'Daniel', testament: 'VT', chapters: 12 },
  { abbrev: 'os', name: 'Oséias', testament: 'VT', chapters: 14 },
  { abbrev: 'jl', name: 'Joel', testament: 'VT', chapters: 3 },
  { abbrev: 'am', name: 'Amós', testament: 'VT', chapters: 9 },
  { abbrev: 'ob', name: 'Obadias', testament: 'VT', chapters: 1 },
  { abbrev: 'jn', name: 'Jonas', testament: 'VT', chapters: 4 },
  { abbrev: 'mq', name: 'Miquéias', testament: 'VT', chapters: 7 },
  { abbrev: 'na', name: 'Naum', testament: 'VT', chapters: 3 },
  { abbrev: 'hc', name: 'Habacuque', testament: 'VT', chapters: 3 },
  { abbrev: 'sf', name: 'Sofonias', testament: 'VT', chapters: 3 },
  { abbrev: 'ag', name: 'Ageu', testament: 'VT', chapters: 2 },
  { abbrev: 'zc', name: 'Zacarias', testament: 'VT', chapters: 14 },
  { abbrev: 'ml', name: 'Malaquias', testament: 'VT', chapters: 4 },

  // Novo Testamento
  { abbrev: 'mt', name: 'Mateus', testament: 'NT', chapters: 28 },
  { abbrev: 'mc', name: 'Marcos', testament: 'NT', chapters: 16 },
  { abbrev: 'lc', name: 'Lucas', testament: 'NT', chapters: 24 },
  { abbrev: 'jo', name: 'João', testament: 'NT', chapters: 21 },
  { abbrev: 'at', name: 'Atos', testament: 'NT', chapters: 28 },
  { abbrev: 'rm', name: 'Romanos', testament: 'NT', chapters: 16 },
  { abbrev: '1co', name: '1 Coríntios', testament: 'NT', chapters: 16 },
  { abbrev: '2co', name: '2 Coríntios', testament: 'NT', chapters: 13 },
  { abbrev: 'gl', name: 'Gálatas', testament: 'NT', chapters: 6 },
  { abbrev: 'ef', name: 'Efésios', testament: 'NT', chapters: 6 },
  { abbrev: 'fp', name: 'Filipenses', testament: 'NT', chapters: 4 },
  { abbrev: 'cl', name: 'Colossenses', testament: 'NT', chapters: 4 },
  { abbrev: '1ts', name: '1 Tessalonicenses', testament: 'NT', chapters: 5 },
  { abbrev: '2ts', name: '2 Tessalonicenses', testament: 'NT', chapters: 3 },
  { abbrev: '1tm', name: '1 Timóteo', testament: 'NT', chapters: 6 },
  { abbrev: '2tm', name: '2 Timóteo', testament: 'NT', chapters: 4 },
  { abbrev: 'tt', name: 'Tito', testament: 'NT', chapters: 3 },
  { abbrev: 'fm', name: 'Filemom', testament: 'NT', chapters: 1 },
  { abbrev: 'hb', name: 'Hebreus', testament: 'NT', chapters: 13 },
  { abbrev: 'tg', name: 'Tiago', testament: 'NT', chapters: 5 },
  { abbrev: '1pe', name: '1 Pedro', testament: 'NT', chapters: 5 },
  { abbrev: '2pe', name: '2 Pedro', testament: 'NT', chapters: 3 },
  { abbrev: '1jo', name: '1 João', testament: 'NT', chapters: 5 },
  { abbrev: '2jo', name: '2 João', testament: 'NT', chapters: 1 },
  { abbrev: '3jo', name: '3 João', testament: 'NT', chapters: 1 },
  { abbrev: 'jd', name: 'Judas', testament: 'NT', chapters: 1 },
  { abbrev: 'ap', name: 'Apocalipse', testament: 'NT', chapters: 22 },
];

class BibleService {
  constructor() {
    // Token de API (opcional, mas recomendado para uso ilimitado)
    // Obtenha grátis em: https://www.abibliadigital.com.br
    this.apiToken = null;
    this.cachePrefix = '@bible_cache_';
  }

  /**
   * Define o token da API para requisições ilimitadas
   */
  setApiToken(token) {
    this.apiToken = token;
  }

  /**
   * Obtém lista de todos os livros
   */
  getAllBooks() {
    return BIBLE_BOOKS;
  }

  /**
   * Obtém livros do Antigo Testamento
   */
  getOldTestamentBooks() {
    return BIBLE_BOOKS.filter(book => book.testament === 'VT');
  }

  /**
   * Obtém livros do Novo Testamento
   */
  getNewTestamentBooks() {
    return BIBLE_BOOKS.filter(book => book.testament === 'NT');
  }

  /**
   * Busca um livro por abreviação
   */
  getBookByAbbrev(abbrev) {
    return BIBLE_BOOKS.find(book => book.abbrev === abbrev);
  }

  /**
   * Salva capítulo no cache local
   */
  async cacheChapter(bookAbbrev, chapter, data) {
    try {
      const key = `${this.cachePrefix}${bookAbbrev}_${chapter}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching chapter:', error);
    }
  }

  /**
   * Busca capítulo do cache local
   */
  async getCachedChapter(bookAbbrev, chapter) {
    try {
      const key = `${this.cachePrefix}${bookAbbrev}_${chapter}`;
      const cached = await AsyncStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Busca capítulo de um livro
   * Usa API pública: A Bíblia Digital
   * CACHE: Primeiro tenta buscar do cache local para economizar requisições
   */
  async getChapter(bookAbbrev, chapter) {
    try {
      // 1. Tentar buscar do cache primeiro
      const cached = await this.getCachedChapter(bookAbbrev, chapter);
      if (cached) {
        console.log('Chapter loaded from cache:', bookAbbrev, chapter);
        return cached;
      }

      // 2. Se não estiver em cache, buscar da API
      const url = `https://www.abibliadigital.com.br/api/verses/nvi/${bookAbbrev}/${chapter}`;

      const headers = {};
      if (this.apiToken) {
        headers['Authorization'] = `Bearer ${this.apiToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        // Tratamento específico para diferentes erros
        if (response.status === 429) {
          throw new Error(
            'Limite de 20 requisições/hora atingido. ' +
            'Aguarde 1 hora ou use o cache offline.'
          );
        } else if (response.status === 404) {
          throw new Error('Capítulo não encontrado');
        } else {
          throw new Error(`Erro ao buscar capítulo (${response.status})`);
        }
      }

      const data = await response.json();

      const result = {
        book: data.book,
        chapter: data.chapter,
        verses: data.verses,
      };

      // 3. Salvar no cache para uso futuro
      await this.cacheChapter(bookAbbrev, chapter, result);

      return result;
    } catch (error) {
      console.error('Error fetching chapter:', error);

      // Tentar buscar do cache como fallback
      const cached = await this.getCachedChapter(bookAbbrev, chapter);
      if (cached) {
        console.log('Using cached version after error');
        return cached;
      }

      throw error;
    }
  }

  /**
   * Busca versículo específico
   */
  async getVerse(bookAbbrev, chapter, verse) {
    try {
      const url = `https://www.abibliadigital.com.br/api/verses/nvi/${bookAbbrev}/${chapter}/${verse}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao buscar versículo');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching verse:', error);
      throw error;
    }
  }

  /**
   * Pesquisa versículos por palavra
   */
  async searchVerses(query) {
    try {
      const url = `https://www.abibliadigital.com.br/api/verses/nvi/search/${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao pesquisar');
      }

      const data = await response.json();
      return data.verses || [];
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
  }
}

export default new BibleService();
