/**
 * Serviço para leitura da Bíblia
 * Dados Offline: Bíblia NVI completa (66 livros) em JSON local
 * Fonte: github.com/thiagobodruk/biblia
 */

// Usar require para arquivos JSON grandes no React Native
const bibleData = require('../data/nvi.json');

// Mapeamento de abreviações para nomes em português
const BOOK_NAMES = {
  gn: 'Gênesis',
  ex: 'Êxodo',
  lv: 'Levítico',
  nm: 'Números',
  dt: 'Deuteronômio',
  js: 'Josué',
  jz: 'Juízes',
  rt: 'Rute',
  '1sm': '1 Samuel',
  '2sm': '2 Samuel',
  '1rs': '1 Reis',
  '2rs': '2 Reis',
  '1cr': '1 Crônicas',
  '2cr': '2 Crônicas',
  ed: 'Esdras',
  ne: 'Neemias',
  et: 'Ester',
  job: 'Jó',
  sl: 'Salmos',
  pv: 'Provérbios',
  ec: 'Eclesiastes',
  ct: 'Cânticos',
  is: 'Isaías',
  jr: 'Jeremias',
  lm: 'Lamentações',
  ez: 'Ezequiel',
  dn: 'Daniel',
  os: 'Oséias',
  jl: 'Joel',
  am: 'Amós',
  ob: 'Obadias',
  jn: 'Jonas',
  mq: 'Miquéias',
  na: 'Naum',
  hc: 'Habacuque',
  sf: 'Sofonias',
  ag: 'Ageu',
  zc: 'Zacarias',
  ml: 'Malaquias',
  mt: 'Mateus',
  mc: 'Marcos',
  lc: 'Lucas',
  jo: 'João',
  at: 'Atos',
  rm: 'Romanos',
  '1co': '1 Coríntios',
  '2co': '2 Coríntios',
  gl: 'Gálatas',
  ef: 'Efésios',
  fp: 'Filipenses',
  cl: 'Colossenses',
  '1ts': '1 Tessalonicenses',
  '2ts': '2 Tessalonicenses',
  '1tm': '1 Timóteo',
  '2tm': '2 Timóteo',
  tt: 'Tito',
  fm: 'Filemom',
  hb: 'Hebreus',
  tg: 'Tiago',
  '1pe': '1 Pedro',
  '2pe': '2 Pedro',
  '1jo': '1 João',
  '2jo': '2 João',
  '3jo': '3 João',
  jd: 'Judas',
  ap: 'Apocalipse',
};

// Índice para separar Antigo e Novo Testamento
const OLD_TESTAMENT_BOOKS = [
  'gn', 'ex', 'lv', 'nm', 'dt', 'js', 'jz', 'rt', '1sm', '2sm',
  '1rs', '2rs', '1cr', '2cr', 'ed', 'ne', 'et', 'job', 'sl', 'pv',
  'ec', 'ct', 'is', 'jr', 'lm', 'ez', 'dn', 'os', 'jl', 'am',
  'ob', 'jn', 'mq', 'na', 'hc', 'sf', 'ag', 'zc', 'ml',
];

class BibleService {
  constructor() {
    // Verificar se os dados foram carregados
    if (!bibleData || !Array.isArray(bibleData)) {
      console.error('Erro ao carregar dados da Bíblia');
      this.books = [];
      return;
    }

    // Processar dados da Bíblia e adicionar metadados
    this.books = bibleData.map(book => ({
      abbrev: book.abbrev,
      name: BOOK_NAMES[book.abbrev] || book.abbrev.toUpperCase(),
      testament: OLD_TESTAMENT_BOOKS.includes(book.abbrev) ? 'VT' : 'NT',
      chapters: book.chapters.length,
      data: book.chapters, // Guardar os dados dos capítulos
    }));

    console.log(`✅ Bíblia carregada: ${this.books.length} livros`);
  }

  /**
   * Obtém lista de todos os livros
   */
  getAllBooks() {
    return this.books.map(({ abbrev, name, testament, chapters }) => ({
      abbrev,
      name,
      testament,
      chapters,
    }));
  }

  /**
   * Obtém livros do Antigo Testamento
   */
  getOldTestamentBooks() {
    return this.getAllBooks().filter(book => book.testament === 'VT');
  }

  /**
   * Obtém livros do Novo Testamento
   */
  getNewTestamentBooks() {
    return this.getAllBooks().filter(book => book.testament === 'NT');
  }

  /**
   * Busca um livro por abreviação
   */
  getBookByAbbrev(abbrev) {
    const book = this.books.find(b => b.abbrev === abbrev);
    if (!book) return null;

    return {
      abbrev: book.abbrev,
      name: book.name,
      testament: book.testament,
      chapters: book.chapters,
    };
  }

  /**
   * Busca capítulo de um livro (100% OFFLINE)
   * @param {string} bookAbbrev - Abreviação do livro (ex: 'gn', 'mt')
   * @param {number} chapter - Número do capítulo (começando em 1)
   * @returns {Promise<Object>} Dados do capítulo com versículos
   */
  async getChapter(bookAbbrev, chapter) {
    try {
      const book = this.books.find(b => b.abbrev === bookAbbrev);

      if (!book) {
        throw new Error(`Livro não encontrado: ${bookAbbrev}`);
      }

      // Validar número do capítulo
      if (chapter < 1 || chapter > book.chapters) {
        throw new Error(
          `Capítulo inválido. ${book.name} tem ${book.chapters} capítulos.`
        );
      }

      // Buscar versículos do capítulo (índice começa em 0)
      const verses = book.data[chapter - 1];

      if (!verses || verses.length === 0) {
        throw new Error('Capítulo sem dados');
      }

      // Formatar versículos com números
      const formattedVerses = verses.map((text, index) => ({
        number: index + 1,
        text: text,
      }));

      return {
        book: {
          abbrev: book.abbrev,
          name: book.name,
        },
        chapter: chapter,
        verses: formattedVerses,
      };
    } catch (error) {
      console.error('Error getting chapter:', error);
      throw error;
    }
  }

  /**
   * Busca versículo específico
   * @param {string} bookAbbrev - Abreviação do livro
   * @param {number} chapter - Número do capítulo
   * @param {number} verseNumber - Número do versículo
   * @returns {Promise<Object>} Dados do versículo
   */
  async getVerse(bookAbbrev, chapter, verseNumber) {
    try {
      const chapterData = await this.getChapter(bookAbbrev, chapter);

      const verse = chapterData.verses.find(v => v.number === verseNumber);

      if (!verse) {
        throw new Error('Versículo não encontrado');
      }

      return {
        book: chapterData.book,
        chapter: chapter,
        verse: verse.number,
        text: verse.text,
      };
    } catch (error) {
      console.error('Error getting verse:', error);
      throw error;
    }
  }

  /**
   * Pesquisa versículos por palavra ou frase
   * @param {string} query - Termo de pesquisa
   * @returns {Promise<Array>} Lista de versículos que contêm o termo
   */
  async searchVerses(query) {
    try {
      if (!query || query.trim().length < 3) {
        return [];
      }

      const searchTerm = query.toLowerCase().trim();
      const results = [];

      // Buscar em todos os livros
      for (const book of this.books) {
        // Buscar em todos os capítulos
        for (let chapterIndex = 0; chapterIndex < book.data.length; chapterIndex++) {
          const verses = book.data[chapterIndex];

          // Buscar em todos os versículos
          for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
            const verseText = verses[verseIndex];

            if (verseText.toLowerCase().includes(searchTerm)) {
              results.push({
                book: {
                  abbrev: book.abbrev,
                  name: book.name,
                },
                chapter: chapterIndex + 1,
                verse: verseIndex + 1,
                text: verseText,
              });
            }
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
  }

  /**
   * Retorna estatísticas da Bíblia
   */
  getStats() {
    const totalBooks = this.books.length;
    const oldTestamentBooks = this.getOldTestamentBooks().length;
    const newTestamentBooks = this.getNewTestamentBooks().length;

    let totalChapters = 0;
    let totalVerses = 0;

    this.books.forEach(book => {
      totalChapters += book.chapters;
      book.data.forEach(chapter => {
        totalVerses += chapter.length;
      });
    });

    return {
      totalBooks,
      oldTestamentBooks,
      newTestamentBooks,
      totalChapters,
      totalVerses,
    };
  }
}

export default new BibleService();
