import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_STORAGE_KEY = '@HelloBible:modules_progress';

/**
 * Serviço para gerenciar módulos de estudo baseados nas
 * 28 Crenças Fundamentais da Igreja Adventista do Sétimo Dia
 */

// Dados dos módulos baseados nas 28 Crenças Fundamentais
export const MODULES_DATA = [
  {
    id: 1,
    title: 'Fundamentos da Fé',
    description: 'Conheça as bases da fé cristã adventista: Escrituras, Trindade e a natureza de Deus.',
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
        title: 'As Sagradas Escrituras',
        description: 'A Bíblia é a Palavra de Deus inspirada, a revelação autorizada de Sua vontade.',
        content: `# As Sagradas Escrituras

## Crença Fundamental #1

**Texto-chave:** "Toda Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção, para a educação na justiça." - 2 Timóteo 3:16

### O que cremos

As Escrituras Sagradas, o Antigo e o Novo Testamentos, são a Palavra de Deus escrita, dada por inspiração divina. Os autores sagrados foram inspirados pelo Espírito Santo.

### Pontos principais

1. **Inspiração Divina**
   - A Bíblia foi escrita por homens inspirados por Deus
   - O Espírito Santo guiou os autores
   - É a revelação infalível da vontade de Deus

2. **Autoridade Suprema**
   - A Bíblia é a norma suprema de fé e prática
   - É o teste pelo qual todo ensinamento deve ser provado
   - Revela princípios eternos

3. **Aplicação Prática**
   - Guia para a vida diária
   - Fonte de sabedoria e conhecimento
   - Transforma vidas através do poder de Deus

### Para reflexão

- Como você tem estudado a Bíblia diariamente?
- De que forma a Palavra de Deus tem transformado sua vida?
- Você confia na Bíblia como sua única regra de fé?

### Versículos para estudo

- 2 Pedro 1:20-21
- Salmos 119:105
- João 17:17
- Hebreus 4:12`,
        verseReference: '2 Timóteo 3:16',
        duration: 15,
      },
      {
        id: 2,
        title: 'A Trindade',
        description: 'Há um só Deus: Pai, Filho e Espírito Santo, uma unidade de três Pessoas coeternas.',
        content: `# A Trindade

## Crença Fundamental #2

**Texto-chave:** "Portanto, ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo." - Mateus 28:19

### O que cremos

Há um só Deus: Pai, Filho e Espírito Santo, uma unidade de três Pessoas coeternas. Deus é imortal, todo-poderoso, onisciente, acima de tudo e sempre presente.

### Pontos principais

1. **Um Só Deus**
   - Monoteísmo bíblico
   - Unidade perfeita entre as três Pessoas
   - Cada Pessoa é plenamente Deus

2. **O Pai**
   - Criador, Fonte e Sustentador de tudo
   - Deus de amor, justiça e misericórdia
   - Pai celestial de todos os crentes

3. **O Filho (Jesus Cristo)**
   - Deus eterno encarnado
   - Salvador da humanidade
   - Mediador entre Deus e os homens

4. **O Espírito Santo**
   - Presente ativo de Deus
   - Consolador e Guia
   - Agente da transformação

### Para reflexão

- Como você experimenta a presença de cada Pessoa da Trindade?
- De que forma o Espírito Santo tem guiado sua vida?
- Qual o papel de Jesus Cristo em sua salvação?

### Versículos para estudo

- Mateus 28:19
- 2 Coríntios 13:13
- João 14:16-17
- 1 João 5:7`,
        verseReference: 'Mateus 28:19',
        duration: 15,
      },
      {
        id: 3,
        title: 'Deus Pai',
        description: 'Deus, o Pai Eterno, é o Criador, Originador, Mantenedor e Soberano de toda a criação.',
        content: `# Deus Pai

## Crença Fundamental #3

**Texto-chave:** "Um só Deus e Pai de todos, o qual é sobre todos, age por meio de todos e está em todos." - Efésios 4:6

### O que cremos

Deus, o Pai Eterno, é o Criador, Originador, Mantenedor e Soberano de toda a criação. Ele é justo e santo, misericordioso e clemente, tardio em irar-Se e grande em constante amor e fidelidade.

### Pontos principais

1. **Criador de Tudo**
   - Autor da vida e do universo
   - Mantém tudo pelo Seu poder
   - Provê para Suas criaturas

2. **Pai Amoroso**
   - Ama incondicionalmente
   - Cuida de cada detalhe
   - Deseja relacionamento com Seus filhos

3. **Soberano Justo**
   - Governa com justiça
   - Misericordioso e compassivo
   - Fiel em todas as Suas promessas

### Para reflexão

- Como você vê Deus como Pai?
- De que forma você tem experimentado Seu amor e cuidado?
- Você confia na soberania de Deus sobre sua vida?

### Versículos para estudo

- Efésios 4:6
- João 3:16
- 1 João 4:8
- Salmos 103:13`,
        verseReference: 'Efésios 4:6',
        duration: 15,
      },
      {
        id: 4,
        title: 'Deus Filho',
        description: 'Jesus Cristo é verdadeiro Deus, eterno, coexistente com o Pai. É o Criador e Salvador.',
        content: `# Deus Filho

## Crença Fundamental #4

**Texto-chave:** "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus." - João 1:1

### O que cremos

Deus, o Filho Eterno, encarnou-Se em Jesus Cristo. Por meio dEle foram criadas todas as coisas, é revelado o caráter de Deus, efetuada a salvação da humanidade e julgado o mundo.

### Pontos principais

1. **Divindade de Cristo**
   - É plenamente Deus
   - Eterno e coexistente com o Pai
   - Criador de todas as coisas

2. **Humanidade de Cristo**
   - Tornou-se plenamente humano
   - Viveu sem pecado
   - Tentado em tudo, mas venceu

3. **Obra Salvadora**
   - Morreu em nosso lugar
   - Ressuscitou para nossa justificação
   - Intercede por nós no Céu

### Para reflexão

- Jesus é seu Salvador pessoal?
- Como a vida de Cristo serve de exemplo para você?
- Você aceita Jesus como Senhor e Salvador?

### Versículos para estudo

- João 1:1-14
- Filipenses 2:5-11
- Colossenses 1:15-20
- Hebreus 1:1-3`,
        verseReference: 'João 1:1',
        duration: 15,
      },
    ],
  },
  {
    id: 2,
    title: 'Salvação e Vida Cristã',
    description: 'Entenda o plano da salvação, o papel do Espírito Santo e como viver uma vida transformada.',
    icon: 'heart-pulse',
    color: {
      from: '#10b981',
      to: '#14b8a6',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#15803d',
    },
    totalLessons: 5,
    estimatedTime: 75,
    lessons: [
      {
        id: 5,
        title: 'Deus Espírito Santo',
        description: 'O Espírito Santo inspira, convence, transforma e santifica.',
        content: `# Deus Espírito Santo

## Crença Fundamental #5

**Texto-chave:** "Mas o Consolador, o Espírito Santo, a quem o Pai enviará em meu nome, esse vos ensinará todas as coisas e vos fará lembrar de tudo o que vos tenho dito." - João 14:26

### O que cremos

Deus, o Espírito Santo, desempenhou uma parte ativa com o Pai e o Filho na Criação, encarnação e redenção. Inspirou os escritores das Escrituras. Enche a vida dos cristãos com poder.

### Pontos principais

1. **Consolador e Guia**
   - Presente de Deus para os crentes
   - Ensina toda a verdade
   - Lembra das palavras de Jesus

2. **Agente de Transformação**
   - Convence do pecado
   - Regenera o coração
   - Produz frutos na vida

3. **Capacitador para o Serviço**
   - Concede dons espirituais
   - Dá poder para testemunhar
   - Guia na missão

### Para reflexão

- Você tem permitido ao Espírito Santo guiar sua vida?
- Quais frutos do Espírito são evidentes em você?
- Como você pode ser mais sensível à Sua voz?

### Versículos para estudo

- João 14:26; 16:7-14
- Atos 1:8
- Gálatas 5:22-23
- 1 Coríntios 12:4-11`,
        verseReference: 'João 14:26',
        duration: 15,
      },
      {
        id: 6,
        title: 'A Criação',
        description: 'Deus é o Criador de todas as coisas e revelou nas Escrituras o relato autêntico de Sua atividade criadora.',
        content: `# A Criação

## Crença Fundamental #6

**Texto-chave:** "No princípio, criou Deus os céus e a terra." - Gênesis 1:1

### O que cremos

Deus é o Criador de todas as coisas e revelou nas Escrituras o relato autêntico de Sua atividade criadora. Em seis dias fez o Senhor "os céus e a terra" e tudo que tem vida sobre a Terra.

### Pontos principais

1. **Deus Criador**
   - Criou tudo em seis dias literais
   - Criação perfeita e harmoniosa
   - Ser humano criado à imagem de Deus

2. **Propósito da Criação**
   - Manifestar a glória de Deus
   - Demonstrar Seu amor
   - Prover lar para a humanidade

3. **Responsabilidade Humana**
   - Mordomia da criação
   - Cuidado com o meio ambiente
   - Respeito pela vida

### Para reflexão

- Como você vê a mão de Deus na criação?
- Você cuida bem do planeta que Deus criou?
- A criação fortalece sua fé em Deus?

### Versículos para estudo

- Gênesis 1-2
- Salmos 19:1-6
- Hebreus 11:3
- Apocalipse 14:7`,
        verseReference: 'Gênesis 1:1',
        duration: 15,
      },
      {
        id: 7,
        title: 'A Natureza do Homem',
        description: 'O ser humano foi criado à imagem de Deus, mas caiu em pecado.',
        content: `# A Natureza do Homem

## Crença Fundamental #7

**Texto-chave:** "Criou Deus, pois, o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou." - Gênesis 1:27

### O que cremos

O homem e a mulher foram feitos à imagem de Deus, com individualidade, poder e liberdade de pensar e agir. Criados como seres livres, cada um é uma unidade indivisível de corpo, mente e espírito.

### Pontos principais

1. **Criação à Imagem de Deus**
   - Capacidade de raciocinar
   - Liberdade de escolha
   - Natureza moral e espiritual

2. **Unidade do Ser**
   - Corpo, mente e espírito integrados
   - Não possui alma imortal
   - Na morte, volta ao pó

3. **Queda e Necessidade**
   - Todos pecaram
   - Necessitam de redenção
   - Dependem da graça de Deus

### Para reflexão

- Você reconhece seu valor como criação de Deus?
- Como você cuida de seu corpo, mente e espírito?
- Você aceita sua necessidade de um Salvador?

### Versículos para estudo

- Gênesis 1:26-27; 2:7
- Salmos 8:4-8
- Romanos 3:23
- Eclesiastes 12:7`,
        verseReference: 'Gênesis 1:27',
        duration: 15,
      },
      {
        id: 8,
        title: 'O Grande Conflito',
        description: 'A humanidade está envolvida num grande conflito entre Cristo e Satanás.',
        content: `# O Grande Conflito

## Crença Fundamental #8

**Texto-chave:** "Houve peleja no céu. Miguel e os seus anjos pelejaram contra o dragão." - Apocalipse 12:7

### O que cremos

Toda a humanidade está envolvida num grande conflito entre Cristo e Satanás quanto ao caráter de Deus, Sua Lei e Sua soberania sobre o Universo.

### Pontos principais

1. **Origem do Conflito**
   - Lúcifer se rebelou no Céu
   - Questionou o caráter de Deus
   - Foi expulso com seus anjos

2. **Campo de Batalha**
   - Terra é o palco do conflito
   - Cada pessoa deve escolher um lado
   - Cristo já garantiu a vitória

3. **Desfecho Final**
   - Satanás será destruído
   - Pecado será erradicado
   - Universo voltará à harmonia

### Para reflexão

- Você está consciente dessa batalha espiritual?
- De que lado você está neste conflito?
- Como você pode resistir ao inimigo?

### Versículos para estudo

- Apocalipse 12:7-9
- Ezequiel 28:12-18
- Isaías 14:12-14
- Efésios 6:12`,
        verseReference: 'Apocalipse 12:7',
        duration: 15,
      },
      {
        id: 9,
        title: 'Vida, Morte e Ressurreição de Cristo',
        description: 'Na vida de Cristo de perfeita obediência à vontade de Deus, Seu sofrimento, morte e ressurreição, Deus proveu o único meio de expiação do pecado.',
        content: `# Vida, Morte e Ressurreição de Cristo

## Crença Fundamental #9

**Texto-chave:** "Mas Deus prova o seu próprio amor para conosco pelo fato de ter Cristo morrido por nós, sendo nós ainda pecadores." - Romanos 5:8

### O que cremos

Na vida de Cristo, Sua morte na cruz e ressurreição, Deus proveu o único meio de expiação do pecado humano. Sua morte é substitutiva, expiatória e reconciliadora.

### Pontos principais

1. **Vida Perfeita**
   - Viveu sem pecado
   - Obediente em tudo
   - Exemplo para nós

2. **Morte Expiatória**
   - Morreu em nosso lugar
   - Pagou o preço do pecado
   - Reconciliou-nos com Deus

3. **Ressurreição Vitoriosa**
   - Venceu a morte
   - Garantiu nossa ressurreição
   - Demonstrou Seu poder

### Para reflexão

- O que a cruz significa para você?
- Você aceitou o sacrifício de Cristo?
- Como a ressurreição impacta sua vida diária?

### Versículos para estudo

- Romanos 5:8-10
- 1 Coríntios 15:3-4
- 1 Pedro 2:21-24
- 2 Coríntios 5:19-21`,
        verseReference: 'Romanos 5:8',
        duration: 15,
      },
    ],
  },
  // Continue com os outros módulos...
  {
    id: 3,
    title: 'A Lei de Deus e o Sábado',
    description: 'Descubra a importância da Lei de Deus e a santidade do Sábado como memorial da criação.',
    icon: 'cash-multiple',
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
        id: 10,
        title: 'A Lei de Deus',
        description: 'Os Dez Mandamentos são a expressão do caráter de Deus e continuam válidos.',
        content: `# A Lei de Deus

## Crença Fundamental #19

**Texto-chave:** "Porque o amor de Deus é este: que guardemos os seus mandamentos; ora, os seus mandamentos não são penosos." - 1 João 5:3

### O que cremos

Os grandes princípios da Lei de Deus são incorporados nos Dez Mandamentos. Eles continuam válidos para a humanidade e são base do juízo de Deus.

### Pontos principais

1. **Natureza da Lei**
   - Expressão do caráter de Deus
   - Santa, justa e boa
   - Eterna e imutável

2. **Propósito da Lei**
   - Revelar o pecado
   - Guiar para uma vida santa
   - Demonstrar necessidade de Cristo

3. **Obediência por Amor**
   - Guardamos por amar a Deus
   - Cristo capacita a obediência
   - Fruto da salvação, não meio

### Os Dez Mandamentos

1. Não terás outros deuses
2. Não farás imagem de escultura
3. Não tomarás o nome de Deus em vão
4. Lembra-te do sábado para santificá-lo
5. Honra teu pai e tua mãe
6. Não matarás
7. Não adulterarás
8. Não furtarás
9. Não darás falso testemunho
10. Não cobiçarás

### Para reflexão

- Você vê a Lei como expressão do amor de Deus?
- Quais mandamentos são mais desafiadores para você?
- Cristo está te capacitando a viver segundo Sua Lei?

### Versículos para estudo

- Êxodo 20:1-17
- Salmos 119:105, 142
- Romanos 7:12
- Mateus 5:17-19`,
        verseReference: '1 João 5:3',
        duration: 15,
      },
      {
        id: 11,
        title: 'O Sábado',
        description: 'O sétimo dia da semana é o Sábado do Senhor, memorial da criação e símbolo de redenção.',
        content: `# O Sábado

## Crença Fundamental #20

**Texto-chave:** "Lembra-te do dia de sábado, para o santificar. Seis dias trabalharás e farás toda a tua obra. Mas o sétimo dia é o sábado do Senhor, teu Deus." - Êxodo 20:8-10

### O que cremos

O beneficente Criador, após os seis dias da Criação, descansou no sétimo dia e instituiu o Sábado para todas as pessoas, como memorial da Criação.

### Pontos principais

1. **Origem do Sábado**
   - Instituído na Criação
   - Antes da queda
   - Para toda a humanidade

2. **Propósito do Sábado**
   - Memorial da Criação
   - Tempo com Deus
   - Renovação física e espiritual
   - Símbolo de redenção

3. **Observância do Sábado**
   - Do pôr do sol de sexta ao pôr do sol de sábado
   - Dia de adoração e comunhão
   - Descanso das atividades seculares
   - Alegria e celebração

### Benefícios do Sábado

- Fortalece o relacionamento com Deus
- Renova as forças
- Promove comunhão familiar
- Lembra-nos de que Deus é o Criador

### Para reflexão

- Como você tem guardado o Sábado?
- O Sábado é um deleite para você?
- Que mudanças pode fazer para torná-lo mais especial?

### Versículos para estudo

- Gênesis 2:1-3
- Êxodo 20:8-11
- Marcos 2:27-28
- Isaías 58:13-14
- Hebreus 4:9-11`,
        verseReference: 'Êxodo 20:8-10',
        duration: 15,
      },
      {
        id: 12,
        title: 'Mordomia',
        description: 'Somos mordomos de Deus, a quem prestamos contas pelo uso do tempo, talentos e recursos.',
        content: `# Mordomia

## Crença Fundamental #21

**Texto-chave:** "Trazei todos os dízimos à casa do Tesouro, para que haja mantimento na minha casa; e provai-me nisto, diz o Senhor dos Exércitos, se eu não vos abrir as janelas do céu e não derramar sobre vós bênção sem medida." - Malaquias 3:10

### O que cremos

Somos mordomos de Deus, a quem prestamos contas pelo uso apropriado do tempo e oportunidades, capacidades e posses, e das bênçãos da Terra e seus recursos.

### Pontos principais

1. **Conceito de Mordomia**
   - Tudo pertence a Deus
   - Somos administradores
   - Prestaremos contas

2. **Áreas de Mordomia**
   - Tempo
   - Talentos e dons
   - Corpo e saúde
   - Recursos financeiros
   - Meio ambiente

3. **Dízimo e Ofertas**
   - Dízimo: 10% da renda
   - Pertence a Deus
   - Sustenta a obra
   - Promessas de bênçãos

### Princípios da Mordomia

1. Reconhecer que Deus é o dono de tudo
2. Usar com sabedoria o que Deus nos confiou
3. Devolver a Deus o que Lhe pertence
4. Confiar nas promessas divinas
5. Ser fiel no pouco e no muito

### Para reflexão

- Você se vê como mordomo ou dono?
- Como está usando o que Deus lhe confiou?
- Você é fiel nos dízimos e ofertas?

### Versículos para estudo

- Malaquias 3:8-12
- 1 Crônicas 29:14
- Mateus 25:14-30
- Lucas 16:10-11
- 2 Coríntios 9:6-7`,
        verseReference: 'Malaquias 3:10',
        duration: 15,
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
