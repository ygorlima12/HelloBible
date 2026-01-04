import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import BibleService from '../services/BibleService';
import OpenAIService from '../services/OpenAIService';

const BibleScreen = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedVerses, setHighlightedVerses] = useState({});
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [quickReference, setQuickReference] = useState('');
  const [pendingScrollVerse, setPendingScrollVerse] = useState(null);
  const [versePositions, setVersePositions] = useState({});
  const versesListRef = useRef(null);
  
  // Modais
  const [showBookModal, setShowBookModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [searchBook, setSearchBook] = useState('');

  const highlightPalette = ['#facc15', '#22c55e', '#38bdf8', '#a855f7', '#f97316'];

  const normalizeText = (text) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Carregar livros ao iniciar
  useEffect(() => {
    loadBooks();
    loadHighlights();
  }, []);

  useEffect(() => {
    if (!pendingScrollVerse) return;
    const target = verses.find(v => v.verse === pendingScrollVerse);
    if (target && versePositions[target.id] !== undefined && versesListRef.current) {
      const y = Math.max(versePositions[target.id] - 80, 0);
      versesListRef.current.scrollTo({ y, animated: true });
      setPendingScrollVerse(null);
    }
  }, [pendingScrollVerse, versePositions, verses]);

  const loadBooks = async () => {
    try {
      console.log('🔄 Carregando livros...');
      const data = await BibleService.getAllBooks();
      console.log('✅ Livros carregados:', data.length);
      setBooks(data);
      
      // Selecionar Gênesis automaticamente
      const genesis = data.find(b => b.abbrev === 'gn');
      if (genesis) {
        setSelectedBook(genesis);
        loadChapter(genesis.abbrev, 1);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar livros:', err);
      setError(err.message);
      Alert.alert('Erro', 'Não foi possível carregar os livros: ' + err.message);
    }
  };

  const loadChapter = async (bookAbbrev, chapterNum) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🔄 Carregando ${bookAbbrev} ${chapterNum}...`);
      const data = await BibleService.getChapter(bookAbbrev, chapterNum);
      console.log(`✅ ${data.length} versículos carregados`);
      setVerses(data);
      setChapter(chapterNum);
      setVersePositions({});
      setSelectedVerse(null);
      setShowVerseModal(false);
      setAiAnswer('');
    } catch (err) {
      console.error('❌ Erro ao carregar capítulo:', err);
      setError(err.message);
      Alert.alert('Erro', 'Não foi possível carregar o capítulo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setShowBookModal(false);
    setSearchBook('');
    loadChapter(book.abbrev, 1);
  };

  const handleSelectChapter = (chapterNum) => {
    setShowChapterModal(false);
    loadChapter(selectedBook.abbrev, chapterNum);
  };

  const handleNextChapter = () => {
    if (!selectedBook) return;
    
    if (chapter < selectedBook.chapters) {
      loadChapter(selectedBook.abbrev, chapter + 1);
    } else {
      // Ir para próximo livro
      const currentIndex = books.findIndex(b => b.abbrev === selectedBook.abbrev);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        setSelectedBook(nextBook);
        loadChapter(nextBook.abbrev, 1);
      } else {
        Alert.alert('Fim', 'Este é o último capítulo da Bíblia!');
      }
    }
  };

  const handlePreviousChapter = () => {
    if (!selectedBook) return;
    
    if (chapter > 1) {
      loadChapter(selectedBook.abbrev, chapter - 1);
    } else {
      // Ir para livro anterior
      const currentIndex = books.findIndex(b => b.abbrev === selectedBook.abbrev);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setSelectedBook(prevBook);
        loadChapter(prevBook.abbrev, prevBook.chapters);
      } else {
        Alert.alert('Início', 'Este é o primeiro capítulo da Bíblia!');
      }
    }
  };

  // Filtrar livros por busca
  const filteredBooks = books.filter(book =>
    normalizeText(`${book.name} ${book.abbrev}`).includes(normalizeText(searchBook))
  );

  // Separar por testamento
  const oldTestament = filteredBooks.filter(b => b.testament === 'VT');
  const newTestament = filteredBooks.filter(b => b.testament === 'NT');

  const loadHighlights = async () => {
    try {
      const stored = await AsyncStorage.getItem('bible_highlights');
      if (stored) {
        setHighlightedVerses(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Erro ao carregar destaques', err);
    }
  };

  const persistHighlights = async (nextHighlights) => {
    setHighlightedVerses(nextHighlights);
    try {
      await AsyncStorage.setItem('bible_highlights', JSON.stringify(nextHighlights));
    } catch (err) {
      console.error('Erro ao salvar destaques', err);
    }
  };

  const handleHighlight = async (color) => {
    if (!selectedVerse) return;
    const currentColor = highlightedVerses[selectedVerse.id];
    const next = { ...highlightedVerses };
    if (currentColor === color) {
      delete next[selectedVerse.id];
    } else {
      next[selectedVerse.id] = color;
    }
    await persistHighlights(next);
  };

  const openVerseActions = (verse) => {
    setSelectedVerse(verse);
    setShowVerseModal(true);
    setAiAnswer('');
  };

  const handleAskAI = async () => {
    if (!selectedVerse || !selectedBook) return;
    const reference = `${selectedBook.name} ${chapter}:${selectedVerse.verse}`;

    const hasKey = await OpenAIService.hasApiKey();
    if (!hasKey) {
      Alert.alert(
        'Configuração Necessária',
        'Configure sua chave da API OpenAI nas configurações para perguntar à IA.'
      );
      return;
    }

    setAiLoading(true);
    try {
      const response = await OpenAIService.analyzeVerse(selectedVerse.text, reference);
      if (response.success === false) {
        throw new Error(response.error);
      }
      setAiAnswer(response.message || 'Não foi possível obter a resposta da IA.');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível perguntar para a IA');
    } finally {
      setAiLoading(false);
    }
  };

  const handleHistoricalContext = () => {
    if (!selectedVerse || !selectedBook) return;
    const reference = `${selectedBook.name} ${chapter}:${selectedVerse.verse}`;
    setShowVerseModal(false);
    navigation.navigate('HistoricalContext', { initialVerse: reference });
  };

  const handleWordOrigin = () => {
    if (!selectedVerse || !selectedBook) return;
    const reference = `${selectedBook.name} ${chapter}:${selectedVerse.verse} - ${selectedVerse.text}`;
    setShowVerseModal(false);
    navigation.navigate('BiblicalDictionary', {
      initialVerseContext: reference,
    });
  };

  const handleQuickSearch = () => {
    if (!quickReference.trim()) return;
    const ref = quickReference.trim();
    const refRegex = /^([1-3]?\s?[\p{L}\.\s]+?)\s+(\d+)(?::(\d+))?$/iu;
    const match = refRegex.exec(ref);

    let bookQuery = ref;
    let chapterNum = null;
    let verseNum = null;

    if (match) {
      bookQuery = match[1];
      chapterNum = parseInt(match[2], 10);
      verseNum = match[3] ? parseInt(match[3], 10) : null;
    }

    const book = books.find(
      (b) =>
        normalizeText(b.name).includes(normalizeText(bookQuery)) ||
        normalizeText(b.abbrev) === normalizeText(bookQuery)
    );

    if (!book) {
      Alert.alert('Livro não encontrado', 'Tente digitar o nome completo ou abreviação.');
      return;
    }

    setSelectedBook(book);
    setShowBookModal(false);
    setShowChapterModal(false);

    if (chapterNum) {
      setPendingScrollVerse(verseNum);
      loadChapter(book.abbrev, chapterNum);
    } else {
      loadChapter(book.abbrev, 1);
    }

    const formattedRef = `${book.name}${chapterNum ? ` ${chapterNum}` : ''}${verseNum ? `:${verseNum}` : ''}`;
    setQuickReference(formattedRef);
  };

  if (!selectedBook) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Carregando Bíblia...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com seletores */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Bíblia Sagrada</Text>

        <View style={styles.quickSearchContainer}>
          <View style={styles.quickSearchInputWrapper}>
            <Icon name="magnify" size={20} color="#c7d2fe" />
            <TextInput
              style={styles.quickSearchInput}
              placeholder="Buscar por livro ou ref. (Ex: Jo 3:16)"
              placeholderTextColor="#c7d2fe"
              value={quickReference}
              onChangeText={setQuickReference}
              onSubmitEditing={handleQuickSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.quickSearchButton} onPress={handleQuickSearch}>
            <Text style={styles.quickSearchButtonText}>Ir</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.quickSearchHint}>
          Toque em um versículo para destacar, perguntar à IA ou abrir ferramentas.
        </Text>

        <View style={styles.selectors}>
          {/* Seletor de Livro */}
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowBookModal(true)}
          >
            <Text style={styles.selectorLabel}>Livro</Text>
            <Text style={styles.selectorValue}>{selectedBook.name}</Text>
          </TouchableOpacity>

          {/* Seletor de Capítulo */}
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowChapterModal(true)}
          >
            <Text style={styles.selectorLabel}>Cap.</Text>
            <Text style={styles.selectorValue}>{chapter}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.info}>{verses.length} versículos</Text>
      </View>

      {/* Navegação rápida */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handlePreviousChapter}
        >
          <Text style={styles.navButtonText}>← Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleNextChapter}
        >
          <Text style={styles.navButtonText}>Próximo →</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Carregando capítulo...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => loadChapter(selectedBook.abbrev, chapter)}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.versesContainer} ref={versesListRef}>
          {verses.map((verse) => {
            const highlightColor = highlightedVerses[verse.id];
            return (
              <TouchableOpacity
                key={verse.id}
                style={[
                  styles.verseRow,
                  highlightColor && { backgroundColor: `${highlightColor}33`, borderColor: highlightColor },
                ]}
                onPress={() => openVerseActions(verse)}
                activeOpacity={0.9}
                onLayout={(event) => {
                  const { y } = event.nativeEvent.layout;
                  setVersePositions((prev) => ({ ...prev, [verse.id]: y }));
                }}
              >
                <Text style={styles.verseNumber}>{verse.verse}</Text>
                <Text style={styles.verseText}>{verse.text}</Text>


                <Text style={styles.verseText}>{verse.text}</Text>

                <View style={styles.verseContent}>
                  <Text style={styles.verseText}>{verse.text}</Text>
                  <View style={styles.verseActionRow}>
                    <View style={styles.tagChip}>
                      <Icon name="gesture-tap" size={14} color="#6366f1" />
                      <Text style={styles.tagChipText}>Ações</Text>
                    </View>
                    {highlightColor ? (
                      <View style={[styles.highlightTag, { backgroundColor: highlightColor }]}>
                        <Text style={styles.highlightTagText}>Destaque</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Icon name="dots-vertical" size={20} color="#94a3b8" />


              </TouchableOpacity>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Modal de Seleção de Livro */}
      <Modal
        visible={showBookModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Livro</Text>
              <TouchableOpacity onPress={() => setShowBookModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Busca */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar livro..."
                value={searchBook}
                onChangeText={setSearchBook}
              />
              {searchBook.length > 0 && (
                <TouchableOpacity onPress={() => setSearchBook('')}>
                  <Text style={styles.clearSearch}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Antigo Testamento */}
              {oldTestament.length > 0 && (
                <>
                  <Text style={styles.testamentTitle}>Antigo Testamento</Text>
                  <View style={styles.booksGrid}>
                    {oldTestament.map((book) => (
                      <TouchableOpacity
                        key={book.abbrev}
                        style={[
                          styles.bookChip,
                          selectedBook?.abbrev === book.abbrev && styles.bookChipSelected
                        ]}
                        onPress={() => handleSelectBook(book)}
                      >
                        <Text style={[
                          styles.bookChipText,
                          selectedBook?.abbrev === book.abbrev && styles.bookChipTextSelected
                        ]}>
                          {book.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Novo Testamento */}
              {newTestament.length > 0 && (
                <>
                  <Text style={styles.testamentTitle}>Novo Testamento</Text>
                  <View style={styles.booksGrid}>
                    {newTestament.map((book) => (
                      <TouchableOpacity
                        key={book.abbrev}
                        style={[
                          styles.bookChip,
                          selectedBook?.abbrev === book.abbrev && styles.bookChipSelected
                        ]}
                        onPress={() => handleSelectBook(book)}
                      >
                        <Text style={[
                          styles.bookChipText,
                          selectedBook?.abbrev === book.abbrev && styles.bookChipTextSelected
                        ]}>
                          {book.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {filteredBooks.length === 0 && (
                <Text style={styles.noResults}>
                  Nenhum livro encontrado com "{searchBook}"
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Capítulo */}
      <Modal
        visible={showChapterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChapterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecione o Capítulo de {selectedBook.name}
              </Text>
              <TouchableOpacity onPress={() => setShowChapterModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.chaptersGrid}>
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapterNum) => (
                  <TouchableOpacity
                    key={chapterNum}
                    style={[
                      styles.chapterChip,
                      chapter === chapterNum && styles.chapterChipSelected
                    ]}
                    onPress={() => handleSelectChapter(chapterNum)}
                  >
                    <Text style={[
                      styles.chapterChipText,
                      chapter === chapterNum && styles.chapterChipTextSelected
                    ]}>
                      {chapterNum}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de ações do versículo */}
      <Modal
        visible={showVerseModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowVerseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verseModalContainer}>
            <View style={styles.modalHandle} />
            {selectedVerse && (
              <>
                <View style={styles.verseModalHeader}>
                  <View style={styles.verseModalBadge}>
                    <Icon name="book-open-variant" size={18} color="#6366f1" />
                    <Text style={styles.verseModalReference}>
                      {selectedBook?.name} {chapter}:{selectedVerse.verse}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowVerseModal(false)}>
                    <Icon name="close" size={22} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.verseModalText}>{selectedVerse.text}</Text>

                <View style={styles.highlightRow}>
                  <Text style={styles.highlightLabel}>Destacar</Text>
                  <View style={styles.highlightOptions}>
                    {highlightPalette.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.highlightDot,
                          { backgroundColor: color },
                          highlightedVerses[selectedVerse.id] === color && styles.highlightDotSelected,
                        ]}
                        onPress={() => handleHighlight(color)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.actionGrid}>
                  <TouchableOpacity style={styles.actionTile} onPress={handleAskAI} disabled={aiLoading}>
                    <Icon name="robot-love" size={22} color="#6366f1" />
                    <Text style={styles.actionTileText}>Perguntar à IA</Text>
                    {aiLoading && <ActivityIndicator size="small" color="#6366f1" />}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionTile} onPress={handleHistoricalContext}>
                    <Icon name="history" size={22} color="#f59e0b" />
                    <Text style={styles.actionTileText}>Contexto histórico</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionTile} onPress={handleWordOrigin}>
                    <Icon name="book-alphabet" size={22} color="#22c55e" />
                    <Text style={styles.actionTileText}>Origem da palavra</Text>
                  </TouchableOpacity>
                </View>

                {aiAnswer ? (
                  <View style={styles.aiAnswerCard}>
                    <View style={styles.aiAnswerHeader}>
                      <Icon name="comment-quote" size={18} color="#6366f1" />
                      <Text style={styles.aiAnswerTitle}>Resposta da IA</Text>
                    </View>
                    <ScrollView style={styles.aiAnswerScroll}>
                      <Text style={styles.aiAnswerText}>{aiAnswer}</Text>
                    </ScrollView>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  selectors: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  selector: {
    flex: 1,
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
  },
  selectorLabel: {
    fontSize: 12,
    color: '#c7d2fe',
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  info: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  navigation: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versesContainer: {
    flex: 1,
    padding: 16,
  },
  verseRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    width: 36,
    textAlign: 'right',
  },
  verseContent: {
    flex: 1,
    gap: 8,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: '#1e293b',
  },
  verseActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagChipText: {
    color: '#4338ca',
    fontWeight: '600',
    fontSize: 12,
  },
  highlightTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  highlightTagText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: '#64748b',
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  clearSearch: {
    fontSize: 20,
    color: '#64748b',
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  testamentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 12,
    marginBottom: 12,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  bookChip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  bookChipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  bookChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  bookChipTextSelected: {
    color: '#fff',
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chapterChip: {
    width: 56,
    height: 56,
    backgroundColor: '#f1f5f9',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  chapterChipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chapterChipText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#475569',
  },
  chapterChipTextSelected: {
    color: '#fff',
  },
  noResults: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 40,
  },
  quickSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: 10,
  },
  quickSearchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4338ca',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickSearchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  quickSearchButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  quickSearchButtonText: {
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: 14,
  },
  quickSearchHint: {
    color: '#c7d2fe',
    marginTop: 8,
    marginBottom: 12,
    fontSize: 13,
  },
  verseModalContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '88%',
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#1f2937',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  verseModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseModalBadge: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verseModalReference: {
    color: '#e0e7ff',
    fontWeight: '700',
  },
  verseModalText: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  highlightLabel: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 14,
  },
  highlightOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  highlightDotSelected: {
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionTile: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  actionTileText: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 13,
  },
  aiAnswerCard: {
    backgroundColor: '#0b1224',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginTop: 8,
    maxHeight: 220,
  },
  aiAnswerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiAnswerTitle: {
    color: '#cbd5e1',
    fontWeight: '800',
  },
  aiAnswerScroll: {
    maxHeight: 180,
  },
  aiAnswerText: {
    color: '#e2e8f0',
    lineHeight: 20,
    fontSize: 14,
  },
});

export default BibleScreen;
