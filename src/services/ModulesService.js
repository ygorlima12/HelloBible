import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_STORAGE_KEY = '@HelloBible:modules_progress';

/**
 * Serviço para gerenciar módulos de estudo
 * Sistema gamificado com lições em formato de cards interativos
 */

// Dados dos módulos com lições em formato de cards
export const MODULES_DATA = [
  {
    id: 1,
    title: 'Fundamentos da Fé',
    description: 'Descubra os pilares essenciais da fé cristã através de uma jornada interativa.',
    icon: 'book-open-variant',
    color: {
      from: '#3b82f6',
      to: '#06b6d4',
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#1d4ed8',
    },
    totalLessons: 4,
    estimatedTime: 60,
    lessons: [
      {
        id: 1,
        title: 'A Palavra de Deus',
        description: 'Entenda a importância e o poder da Bíblia em sua vida.',
        duration: 15,
        verseReference: '2 Timóteo 3:16',
        cards: [
          {
            type: 'content',
            icon: 'book-open-page-variant',
            title: 'O Livro Sagrado',
            content: 'A Bíblia é mais que um livro comum. É a Palavra inspirada de Deus, escrita por pessoas guiadas pelo Espírito Santo. Ela contém sabedoria eterna para guiar sua vida.',
          },
          {
            type: 'content',
            icon: 'lightbulb-on',
            title: 'Uma Luz no Caminho',
            content: 'A Bíblia ilumina nosso caminho como uma lanterna na escuridão. Ela nos mostra a direção certa quando estamos perdidos e nos dá respostas para as questões mais profundas da vida.',
            verse: '"Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho."',
            verseReference: 'Salmos 119:105',
          },
          {
            type: 'content',
            icon: 'shield-check',
            title: 'Seu Guia Confiável',
            content: 'Você pode confiar na Bíblia como sua fonte de verdade. Ela tem transformado vidas há milhares de anos e continua relevante hoje.',
            keyPoints: [
              'A Bíblia é inspirada por Deus',
              'Ela é confiável e verdadeira',
              'Transforma vidas quando aplicada',
              'É seu manual para a vida',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'O que torna a Bíblia especial?',
                options: [
                  'É um livro muito antigo',
                  'Foi inspirada por Deus',
                  'Tem muitas páginas',
                  'Foi escrita por sábios',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Como a Bíblia pode ajudar você?',
                options: [
                  'Apenas como decoração',
                  'Para estudos históricos',
                  'Como guia para a vida',
                  'Somente aos domingos',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Quem é Deus?',
        description: 'Conheça o caráter amoroso de Deus e como Ele se relaciona com você.',
        duration: 15,
        verseReference: '1 João 4:8',
        cards: [
          {
            type: 'content',
            icon: 'heart',
            title: 'Deus é Amor',
            content: 'A característica mais importante de Deus é Seu amor. Ele não apenas ama - Ele É amor. Esse amor é incondicional, eterno e transformador.',
            verse: '"Deus é amor."',
            verseReference: '1 João 4:8',
          },
          {
            type: 'content',
            icon: 'account-group',
            title: 'Três em Um',
            content: 'Deus se revela de três formas: como Pai Criador, como Filho Salvador (Jesus), e como Espírito Santo Consolador. Três Pessoas, mas um só Deus.',
            keyPoints: [
              'Deus Pai - Nosso Criador',
              'Jesus - Nosso Salvador',
              'Espírito Santo - Nosso Guia',
              'Unidos em amor por você',
            ],
          },
          {
            type: 'content',
            icon: 'account-heart',
            title: 'Ele Se Importa com Você',
            content: 'Deus não é distante ou indiferente. Ele conhece você pessoalmente, se importa com cada detalhe da sua vida e deseja um relacionamento real com você.',
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Qual é a natureza essencial de Deus?',
                options: [
                  'Ele é rigoroso e distante',
                  'Ele é amor',
                  'Ele é indiferente',
                  'Ele é imprevisível',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Como Deus se manifesta?',
                options: [
                  'Apenas como Pai',
                  'Somente como Jesus',
                  'Como Pai, Filho e Espírito Santo',
                  'Ele não se manifesta',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
      {
        id: 3,
        title: 'Jesus - O Salvador',
        description: 'Descubra quem é Jesus e por que Ele veio ao mundo.',
        duration: 15,
        verseReference: 'João 3:16',
        cards: [
          {
            type: 'content',
            icon: 'star',
            title: 'Deus Se Tornou Humano',
            content: 'Jesus não é apenas um profeta ou mestre. Ele é Deus que se tornou humano para nos salvar. Viveu como nós, mas sem pecado.',
          },
          {
            type: 'content',
            icon: 'heart-broken',
            title: 'Morreu Por Você',
            content: 'Jesus morreu na cruz para pagar o preço dos nossos erros. Ele tomou nosso lugar, recebendo a punição que merecíamos.',
            verse: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna."',
            verseReference: 'João 3:16',
          },
          {
            type: 'content',
            icon: 'emoticon-excited',
            title: 'Ressuscitou!',
            content: 'A história não terminou na cruz. Jesus ressuscitou três dias depois, provando que Ele venceu a morte e o pecado. Por isso, você também pode ter vida eterna!',
            keyPoints: [
              'Jesus viveu uma vida perfeita',
              'Morreu em nosso lugar',
              'Ressuscitou ao terceiro dia',
              'Oferece salvação gratuita a todos',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Quem é Jesus?',
                options: [
                  'Apenas um bom professor',
                  'Um profeta comum',
                  'Deus que se tornou humano',
                  'Um líder religioso',
                ],
                correctAnswer: 2,
              },
              {
                question: 'Por que Jesus morreu na cruz?',
                options: [
                  'Por ser um criminoso',
                  'Para nos salvar do pecado',
                  'Por acidente',
                  'Porque foi traído',
                ],
                correctAnswer: 1,
              },
              {
                question: 'O que aconteceu três dias depois?',
                options: [
                  'Nada aconteceu',
                  'Ele foi esquecido',
                  'Ele ressuscitou',
                  'Seus discípulos fugiram',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
      {
        id: 4,
        title: 'O Espírito Santo',
        description: 'Conheça o Consolador que habita em você e te guia diariamente.',
        duration: 15,
        verseReference: 'João 14:26',
        cards: [
          {
            type: 'content',
            icon: 'weather-windy',
            title: 'Quem é o Espírito Santo?',
            content: 'O Espírito Santo não é uma força ou energia impessoal. Ele é uma Pessoa - a terceira Pessoa da Trindade. Ele é Deus presente em você.',
          },
          {
            type: 'content',
            icon: 'compass',
            title: 'Seu Guia Pessoal',
            content: 'O Espírito Santo é como um GPS espiritual. Ele te guia nas decisões, te ensina a verdade, te lembra das palavras de Jesus e te dá força para viver corretamente.',
            verse: '"Mas o Consolador, o Espírito Santo, a quem o Pai enviará em meu nome, esse vos ensinará todas as coisas."',
            verseReference: 'João 14:26',
          },
          {
            type: 'content',
            icon: 'gift',
            title: 'Presentes Especiais',
            content: 'O Espírito Santo dá dons espirituais - habilidades especiais para servir a Deus e ajudar outros. Ele também produz frutos em sua vida: amor, alegria, paz e muito mais!',
            keyPoints: [
              'Ele te guia e ensina',
              'Transforma seu caráter',
              'Dá poder para viver bem',
              'Concede dons para servir',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'O que é o Espírito Santo?',
                options: [
                  'Uma força impessoal',
                  'A terceira Pessoa da Trindade',
                  'Um anjo especial',
                  'Uma energia mística',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Qual é o papel do Espírito Santo?',
                options: [
                  'Apenas observar',
                  'Nos condenar',
                  'Nos guiar e transformar',
                  'Nos punir',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Vivendo a Fé',
    description: 'Aprenda como aplicar a fé no seu dia a dia de forma prática e transformadora.',
    icon: 'heart-pulse',
    color: {
      from: '#10b981',
      to: '#14b8a6',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#15803d',
    },
    totalLessons: 3,
    estimatedTime: 45,
    lessons: [
      {
        id: 5,
        title: 'Oração - Falando com Deus',
        description: 'Descubra como ter uma conversa real e poderosa com Deus.',
        duration: 15,
        verseReference: 'Mateus 6:6',
        cards: [
          {
            type: 'content',
            icon: 'chat',
            title: 'Uma Conversa Real',
            content: 'Oração não é repetir palavras bonitas ou usar uma linguagem formal. É simplesmente conversar com Deus como você fala com um amigo próximo.',
          },
          {
            type: 'content',
            icon: 'door-open',
            title: 'Deus Está Ouvindo',
            content: 'Você pode falar com Deus a qualquer hora, em qualquer lugar, sobre qualquer coisa. Ele sempre está disponível e nunca está ocupado demais para você.',
            verse: '"Peçam, e será dado a vocês; busquem, e encontrarão; batam, e a porta será aberta."',
            verseReference: 'Mateus 7:7',
          },
          {
            type: 'content',
            icon: 'format-list-checks',
            title: 'Como Orar?',
            content: 'Não existe fórmula mágica, mas você pode seguir este guia simples:',
            keyPoints: [
              'Comece agradecendo a Deus',
              'Confesse seus erros',
              'Peça o que precisa',
              'Ore pelos outros',
              'Ouça o que Deus quer te dizer',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'O que é oração?',
                options: [
                  'Repetir palavras decoradas',
                  'Conversar com Deus',
                  'Algo só para pastores',
                  'Um ritual complicado',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Quando posso orar?',
                options: [
                  'Apenas aos domingos',
                  'Somente na igreja',
                  'A qualquer hora e lugar',
                  'Só em emergências',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
      {
        id: 6,
        title: 'Perdão e Graça',
        description: 'Entenda o poder transformador do perdão de Deus.',
        duration: 15,
        verseReference: '1 João 1:9',
        cards: [
          {
            type: 'content',
            icon: 'heart-remove',
            title: 'Todos Erramos',
            content: 'Ninguém é perfeito. Todos nós cometemos erros e falhamos. Mas a boa notícia é que Deus não desistiu de você!',
          },
          {
            type: 'content',
            icon: 'check-circle',
            title: 'Perdão Gratuito',
            content: 'Deus oferece perdão completo e gratuito. Você não precisa merecer, pagar ou ser bom o suficiente. Basta confessar e aceitar.',
            verse: '"Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar."',
            verseReference: '1 João 1:9',
          },
          {
            type: 'content',
            icon: 'refresh',
            title: 'Recomeço Total',
            content: 'Quando Deus perdoa, Ele apaga completamente seu passado. É como se você nunca tivesse errado. Ele te dá um recomeço fresco!',
            keyPoints: [
              'Deus perdoa qualquer erro',
              'O perdão é gratuito',
              'Você recebe um novo começo',
              'Deve perdoar os outros também',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Quem pode receber o perdão de Deus?',
                options: [
                  'Apenas pessoas muito boas',
                  'Somente líderes religiosos',
                  'Qualquer pessoa que confesse',
                  'Ninguém merece perdão',
                ],
                correctAnswer: 2,
              },
              {
                question: 'O que você precisa fazer para ser perdoado?',
                options: [
                  'Pagar uma quantia',
                  'Fazer boas obras primeiro',
                  'Confessar e aceitar',
                  'Esperar merecer',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
      {
        id: 7,
        title: 'Fé em Ação',
        description: 'Transforme sua fé em atitudes práticas que fazem diferença.',
        duration: 15,
        verseReference: 'Tiago 2:17',
        cards: [
          {
            type: 'content',
            icon: 'run-fast',
            title: 'Fé Que Age',
            content: 'Fé verdadeira não é apenas acreditar com a mente. É confiar tanto em Deus que suas ações refletem essa confiança.',
          },
          {
            type: 'content',
            icon: 'hand-heart',
            title: 'Amor em Prática',
            content: 'Sua fé deve se manifestar através do amor. Ajudar quem precisa, perdoar quem te machucou, ser gentil, generoso e compassivo.',
            verse: '"A fé sem obras é morta."',
            verseReference: 'Tiago 2:17',
          },
          {
            type: 'content',
            icon: 'lightbulb-on',
            title: 'Seja a Luz',
            content: 'Você foi chamado para ser luz no mundo. Isso significa viver de forma que outros vejam Deus através de você.',
            keyPoints: [
              'Pratique o amor diariamente',
              'Ajude quem está necessitado',
              'Seja honesto e íntegro',
              'Compartilhe sua fé com outros',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Como a fé verdadeira se manifesta?',
                options: [
                  'Apenas em palavras',
                  'Através de ações',
                  'Não precisa se manifestar',
                  'Só em pensamentos',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Qual é o papel do cristão no mundo?',
                options: [
                  'Se isolar das pessoas',
                  'Julgar os outros',
                  'Ser luz e ajudar',
                  'Apenas frequentar igreja',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Princípios de Vida',
    description: 'Descubra princípios eternos que trazem paz, propósito e plenitude.',
    icon: 'compass',
    color: {
      from: '#f59e0b',
      to: '#f97316',
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#b45309',
    },
    totalLessons: 3,
    estimatedTime: 45,
    lessons: [
      {
        id: 8,
        title: 'Os Mandamentos de Deus',
        description: 'Entenda os princípios de amor que guiam uma vida plena.',
        duration: 15,
        verseReference: 'João 14:15',
        cards: [
          {
            type: 'content',
            icon: 'book-heart',
            title: 'Guia Para a Vida',
            content: 'Os mandamentos de Deus não são regras para te limitar, mas um mapa para te proteger e levar à felicidade verdadeira.',
          },
          {
            type: 'content',
            icon: 'shield-heart',
            title: 'Proteção e Liberdade',
            content: 'Cada mandamento é como uma cerca de proteção. Dentro deles, você encontra verdadeira liberdade e paz.',
            keyPoints: [
              'Amar a Deus acima de tudo',
              'Não adorar ídolos ou imagens',
              'Respeitar o nome de Deus',
              'Guardar um dia especial com Deus',
              'Honrar pai e mãe',
              'Não tirar vidas',
              'Ser fiel nos relacionamentos',
              'Não roubar',
              'Não mentir',
              'Não cobiçar o que é dos outros',
            ],
          },
          {
            type: 'content',
            icon: 'heart',
            title: 'Resumo: Amor',
            content: 'Jesus resumiu tudo em duas regras simples: Amar a Deus com todo seu coração, e amar seu próximo como a si mesmo.',
            verse: '"Se vocês me amam, obedecerão aos meus mandamentos."',
            verseReference: 'João 14:15',
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Qual é o propósito dos mandamentos?',
                options: [
                  'Nos limitar e punir',
                  'Nos proteger e guiar',
                  'Nos fazer infelizes',
                  'São regras antigas sem valor',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Como Jesus resumiu os mandamentos?',
                options: [
                  'Em 10 regras complicadas',
                  'Não importa mais hoje',
                  'Amar a Deus e ao próximo',
                  'Apenas cumprir rituais',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
      {
        id: 9,
        title: 'Generosidade e Mordomia',
        description: 'Aprenda sobre administrar bem o que Deus te confiou.',
        duration: 15,
        verseReference: '2 Coríntios 9:7',
        cards: [
          {
            type: 'content',
            icon: 'gift',
            title: 'Tudo é de Deus',
            content: 'Tudo o que você tem é um presente de Deus. Você é um administrador dos recursos que Ele te confiou: tempo, talentos, dinheiro, saúde.',
          },
          {
            type: 'content',
            icon: 'hand-coin',
            title: 'Alegria em Dar',
            content: 'Deus ama quem dá com alegria! Não é sobre quanto você dá, mas com que atitude. Ser generoso traz bênçãos para você e para outros.',
            verse: '"Cada um contribua segundo propôs no coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria."',
            verseReference: '2 Coríntios 9:7',
          },
          {
            type: 'content',
            icon: 'cash-multiple',
            title: 'Devolvendo a Deus',
            content: 'Uma forma de agradecer a Deus é devolvendo parte do que Ele nos deu. Isso demonstra confiança e gratidão.',
            keyPoints: [
              'Tudo pertence a Deus',
              'Seja fiel com o que tem',
              'Dê com alegria, não por obrigação',
              'Confie que Deus provê',
              'Use seus recursos para abençoar',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'De quem são realmente seus bens?',
                options: [
                  'São 100% meus',
                  'Da minha família',
                  'São presentes de Deus',
                  'Do governo',
                ],
                correctAnswer: 2,
              },
              {
                question: 'Como devemos dar?',
                options: [
                  'Com tristeza e obrigação',
                  'Com alegria e gratidão',
                  'Apenas quando sobra',
                  'Não precisamos dar',
                ],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
      {
        id: 10,
        title: 'Cuidando do Templo',
        description: 'Aprenda a cuidar bem do seu corpo, a morada do Espírito Santo.',
        duration: 15,
        verseReference: '1 Coríntios 6:19-20',
        cards: [
          {
            type: 'content',
            icon: 'human-handsup',
            title: 'Seu Corpo é Especial',
            content: 'Seu corpo não é só carne e ossos. É o templo onde o Espírito Santo habita! Por isso, merece cuidado e respeito.',
          },
          {
            type: 'content',
            icon: 'food-apple',
            title: 'Escolhas Saudáveis',
            content: 'Deus se importa com sua saúde física. Escolher alimentos nutritivos, se exercitar, descansar bem e evitar vícios honra a Deus.',
            verse: '"Ou não sabeis que o vosso corpo é o templo do Espírito Santo? Glorificai, pois, a Deus no vosso corpo."',
            verseReference: '1 Coríntios 6:19-20',
          },
          {
            type: 'content',
            icon: 'heart-pulse',
            title: 'Saúde Integral',
            content: 'Saúde não é só física. Cuide também da sua mente (evite pensamentos negativos) e do seu espírito (mantenha comunhão com Deus).',
            keyPoints: [
              'Alimente-se de forma saudável',
              'Pratique exercícios físicos',
              'Descanse adequadamente',
              'Evite vícios e excessos',
              'Cuide da saúde mental e espiritual',
            ],
          },
          {
            type: 'quiz',
            questions: [
              {
                question: 'Por que devemos cuidar do corpo?',
                options: [
                  'Apenas por vaidade',
                  'Para viver mais tempo',
                  'Porque é templo do Espírito Santo',
                  'Não precisamos cuidar',
                ],
                correctAnswer: 2,
              },
              {
                question: 'O que inclui saúde integral?',
                options: [
                  'Apenas exercícios físicos',
                  'Somente alimentação',
                  'Física, mental e espiritual',
                  'Não importa a saúde',
                ],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },
    ],
  },
];

class ModulesService {
  /**
   * Obtém todos os módulos
   */
  async getAllModules() {
    try {
      const progress = await this.getProgress();

      return MODULES_DATA.map(module => ({
        ...module,
        progress: this.calculateModuleProgress(module.id, progress),
        completedLessons: this.getCompletedLessons(module.id, progress),
      }));
    } catch (error) {
      console.error('Error getting modules:', error);
      return MODULES_DATA;
    }
  }

  /**
   * Obtém um módulo específico
   */
  async getModuleById(moduleId) {
    try {
      const module = MODULES_DATA.find(m => m.id === moduleId);
      if (!module) return null;

      const progress = await this.getProgress();

      return {
        ...module,
        progress: this.calculateModuleProgress(moduleId, progress),
        completedLessons: this.getCompletedLessons(moduleId, progress),
      };
    } catch (error) {
      console.error('Error getting module:', error);
      return null;
    }
  }

  /**
   * Marca uma lição como completa
   */
  async completeLesson(moduleId, lessonId) {
    try {
      const progress = await this.getProgress();

      if (!progress[moduleId]) {
        progress[moduleId] = { lessons: [] };
      }

      if (!progress[moduleId].lessons.includes(lessonId)) {
        progress[moduleId].lessons.push(lessonId);
        await this.saveProgress(progress);
      }

      return true;
    } catch (error) {
      console.error('Error completing lesson:', error);
      return false;
    }
  }

  /**
   * Verifica se uma lição está completa
   */
  async isLessonComplete(moduleId, lessonId) {
    try {
      const progress = await this.getProgress();
      return progress[moduleId]?.lessons?.includes(lessonId) || false;
    } catch (error) {
      console.error('Error checking lesson:', error);
      return false;
    }
  }

  /**
   * Obtém o progresso geral
   */
  async getProgress() {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  }

  /**
   * Salva o progresso
   */
  async saveProgress(progress) {
    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  /**
   * Calcula o progresso de um módulo (0-1)
   */
  calculateModuleProgress(moduleId, progress) {
    const module = MODULES_DATA.find(m => m.id === moduleId);
    if (!module) return 0;

    const completedLessons = progress[moduleId]?.lessons?.length || 0;
    return completedLessons / module.totalLessons;
  }

  /**
   * Obtém número de lições completas
   */
  getCompletedLessons(moduleId, progress) {
    return progress[moduleId]?.lessons?.length || 0;
  }

  /**
   * Reseta o progresso de um módulo
   */
  async resetModuleProgress(moduleId) {
    try {
      const progress = await this.getProgress();
      delete progress[moduleId];
      await this.saveProgress(progress);
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  }

  /**
   * Obtém estatísticas gerais
   */
  async getStats() {
    try {
      const progress = await this.getProgress();

      let totalLessons = 0;
      let completedLessons = 0;

      MODULES_DATA.forEach(module => {
        totalLessons += module.totalLessons;
        completedLessons += progress[module.id]?.lessons?.length || 0;
      });

      return {
        totalModules: MODULES_DATA.length,
        completedModules: Object.keys(progress).length,
        totalLessons,
        completedLessons,
        overallProgress: totalLessons > 0 ? completedLessons / totalLessons : 0,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalModules: MODULES_DATA.length,
        completedModules: 0,
        totalLessons: 0,
        completedLessons: 0,
        overallProgress: 0,
      };
    }
  }
}

export default new ModulesService();
