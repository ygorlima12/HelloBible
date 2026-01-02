/**
 * Serviço para leitura da Bíblia
 * Dados Offline: Bíblia NVI completa (66 livros) em arquivos JSON separados
 * Fonte: github.com/thiagobodruk/biblia
 *
 * OTIMIZAÇÃO: Lazy loading - carrega livros apenas quando necessário
 */

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

// Funções lazy para carregar cada livro (só executa quando chamado)
const LAZY_LOADERS = {
  gn: () => require('../data/books/gn.json'),
  ex: () => require('../data/books/ex.json'),
  lv: () => require('../data/books/lv.json'),
  nm: () => require('../data/books/nm.json'),
  dt: () => require('../data/books/dt.json'),
  js: () => require('../data/books/js.json'),
  jz: () => require('../data/books/jz.json'),
  rt: () => require('../data/books/rt.json'),
  '1sm': () => require('../data/books/1sm.json'),
  '2sm': () => require('../data/books/2sm.json'),
  '1rs': () => require('../data/books/1rs.json'),
  '2rs': () => require('../data/books/2rs.json'),
  '1cr': () => require('../data/books/1cr.json'),
  '2cr': () => require('../data/books/2cr.json'),
  ed: () => require('../data/books/ed.json'),
  ne: () => require('../data/books/ne.json'),
  et: () => require('../data/books/et.json'),
  job: () => require('../data/books/job.json'),
  sl: () => require('../data/books/sl.json'),
  pv: () => require('../data/books/pv.json'),
  ec: () => require('../data/books/ec.json'),
  ct: () => require('../data/books/ct.json'),
  is: () => require('../data/books/is.json'),
  jr: () => require('../data/books/jr.json'),
  lm: () => require('../data/books/lm.json'),
  ez: () => require('../data/books/ez.json'),
  dn: () => require('../data/books/dn.json'),
  os: () => require('../data/books/os.json'),
  jl: () => require('../data/books/jl.json'),
  am: () => require('../data/books/am.json'),
  ob: () => require('../data/books/ob.json'),
  jn: () => require('../data/books/jn.json'),
  mq: () => require('../data/books/mq.json'),
  na: () => require('../data/books/na.json'),
  hc: () => require('../data/books/hc.json'),
  sf: () => require('../data/books/sf.json'),
  ag: () => require('../data/books/ag.json'),
  zc: () => require('../data/books/zc.json'),
  ml: () => require('../data/books/ml.json'),
  mt: () => require('../data/books/mt.json'),
  mc: () => require('../data/books/mc.json'),
  lc: () => require('../data/books/lc.json'),
  jo: () => require('../data/books/jo.json'),
  at: () => require('../data/books/atos.json'),
  rm: () => require('../data/books/rm.json'),
  '1co': () => require('../data/books/1co.json'),
  '2co': () => require('../data/books/2co.json'),
  gl: () => require('../data/books/gl.json'),
  ef: () => require('../data/books/ef.json'),
  fp: () => require('../data/books/fp.json'),
  cl: () => require('../data/books/cl.json'),
  '1ts': () => require('../data/books/1ts.json'),
  '2ts': () => require('../data/books/2ts.json'),
  '1tm': () => require('../data/books/1tm.json'),
  '2tm': () => require('../data/books/2tm.json'),
  tt: () => require('../data/books/tt.json'),
  fm: () => require('../data/books/fm.json'),
  hb: () => require('../data/books/hb.json'),
  tg: () => require('../data/books/tg.json'),
  '1pe': () => require('../data/books/1pe.json'),
  '2pe': () => require('../data/books/2pe.json'),
  '1jo': () => require('../data/books/1jo.json'),
  '2jo': () => require('../data/books/2jo.json'),
  '3jo': () => require('../data/books/3jo.json'),
  jd: () => require('../data/books/jd.json'),
  ap: () => require('../data/books/ap.json'),
};

// Carregar índice (arquivo pequeno)
const booksIndex = require('../data/books/index.json');

class BibleService {
  constructor() {
    // Cache de livros já carregados
    this.loadedBooks = {};

    // Processar metadados dos livros do índice
    this.booksMetadata = booksIndex.map(book => ({
      abbrev: book.abbrev,
      name: BOOK_NAMES[book.abbrev] || book.abbrev.toUpperCase(),
      testament: OLD_TESTAMENT_BOOKS.includes(book.abbrev) ? 'VT' : 'NT',
      chapters: book.chapters,
    }));

    console.log(`✅ BibleService iniciado: ${this.booksMetadata.length} livros disponíveis`);
  }

  /**
   * Carrega um livro sob demanda (lazy loading)
   */
  loadBookData(abbrev) {
    // Se já está no cache, retornar
    if (this.loadedBooks[abbrev]) {
      return this.loadedBooks[abbrev];
    }

    // Carregar usando a função lazy
    const loader = LAZY_LOADERS[abbrev];
    if (!loader) {
      console.error(`Loader not found for book: ${abbrev}`);
      return null;
    }

    try {
      const bookData = loader();
      this.loadedBooks[abbrev] = bookData;
      console.log(`📖 Livro carregado: ${BOOK_NAMES[abbrev] || abbrev}`);
      return bookData;
    } catch (error) {
      console.error(`Erro ao carregar livro ${abbrev}:`, error);
      return null;
    }
  }

  /**
   * Obtém lista de todos os livros
   */
  getAllBooks() {
    return this.booksMetadata;
  }

  /**
   * Obtém livros do Antigo Testamento
   */
  getOldTestamentBooks() {
    return this.booksMetadata.filter(book => book.testament === 'VT');
  }

  /**
   * Obtém livros do Novo Testamento
   */
  getNewTestamentBooks() {
    return this.booksMetadata.filter(book => book.testament === 'NT');
  }

  /**
   * Busca um livro por abreviação
   */
  getBookByAbbrev(abbrev) {
    return this.booksMetadata.find(b => b.abbrev === abbrev) || null;
  }

  /**
   * Busca capítulo de um livro (100% OFFLINE)
   */
  async getChapter(bookAbbrev, chapter) {
    try {
      // Buscar metadados do livro
      const bookMeta = this.getBookByAbbrev(bookAbbrev);

      if (!bookMeta) {
        throw new Error(`Livro não encontrado: ${bookAbbrev}`);
      }

      // Validar número do capítulo
      if (chapter < 1 || chapter > bookMeta.chapters) {
        throw new Error(
          `Capítulo inválido. ${bookMeta.name} tem ${bookMeta.chapters} capítulos.`
        );
      }

      // Carregar dados do livro (lazy)
      const bookData = this.loadBookData(bookAbbrev);

      if (!bookData || !bookData.chapters) {
        throw new Error('Erro ao carregar dados do livro');
      }

      // Buscar versículos do capítulo (índice começa em 0)
      const verses = bookData.chapters[chapter - 1];

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
          abbrev: bookMeta.abbrev,
          name: bookMeta.name,
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
   */
  async searchVerses(query) {
    try {
      if (!query || query.trim().length < 3) {
        return [];
      }

      const searchTerm = query.toLowerCase().trim();
      const results = [];

      // Buscar em todos os livros
      for (const bookMeta of this.booksMetadata) {
        const bookData = this.loadBookData(bookMeta.abbrev);

        if (!bookData || !bookData.chapters) continue;

        // Buscar em todos os capítulos
        for (let chapterIndex = 0; chapterIndex < bookData.chapters.length; chapterIndex++) {
          const verses = bookData.chapters[chapterIndex];

          // Buscar em todos os versículos
          for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
            const verseText = verses[verseIndex];

            if (verseText.toLowerCase().includes(searchTerm)) {
              results.push({
                book: {
                  abbrev: bookMeta.abbrev,
                  name: bookMeta.name,
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
    const totalBooks = this.booksMetadata.length;
    const oldTestamentBooks = this.getOldTestamentBooks().length;
    const newTestamentBooks = this.getNewTestamentBooks().length;

    let totalChapters = 0;
    let totalVerses = 0;

    this.booksMetadata.forEach(bookMeta => {
      totalChapters += bookMeta.chapters;

      const bookData = this.loadBookData(bookMeta.abbrev);
      if (bookData && bookData.chapters) {
        bookData.chapters.forEach(chapter => {
          totalVerses += chapter.length;
        });
      }
    });

    return {
      totalBooks,
      oldTestamentBooks,
      newTestamentBooks,
      totalChapters,
      totalVerses,
    };
  }

  /**
   * Limpa o cache de livros carregados
   */
  clearCache() {
    this.loadedBooks = {};
    console.log('✅ Cache de livros limpo');
  }
}

export default new BibleService();
