import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BibleService from '../services/BibleService';
import HighlightsService, { HIGHLIGHT_COLORS } from '../services/HighlightsService';
import OpenAIService from '../services/OpenAIService';

const BibleScreen = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Estados para versículo selecionado e modal
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showVerseMenu, setShowVerseMenu] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Iniciar com Gênesis 1
    const genesis = BibleService.getBookByAbbrev('gn');
    setSelectedBook(genesis);
    loadChapter('gn', 1);
  }, []);

  const loadChapter = async (bookAbbrev, chapter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await BibleService.getChapter(bookAbbrev, chapter);
      setChapterData(data);
      setSelectedChapter(chapter);
      setError(null);

      // Carregar highlights deste capítulo
      await loadHighlightsForChapter(bookAbbrev, chapter);
    } catch (err) {
      console.error('Error loading chapter:', err);
      setError(err.message || 'Erro ao carregar capítulo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadHighlightsForChapter = async (bookAbbrev, chapter) => {
    try {
      const allHighlights = await HighlightsService.loadHighlights();
      const chapterHighlights = {};

      Object.keys(allHighlights).forEach(key => {
        const h = allHighlights[key];
        if (h.bookAbbrev === bookAbbrev && h.chapter === chapter) {
          chapterHighlights[h.verse] = h;
        }
      });

      setHighlights(chapterHighlights);
    } catch (error) {
      console.error('Error loading highlights:', error);
    }
  };

  const handleVersePress = (verse) => {
    setSelectedVerse(verse);
    setShowVerseMenu(true);
  };

  const handleHighlight = async (color) => {
    if (!selectedVerse || !selectedBook) return;

    try {
      await HighlightsService.addHighlight(
        selectedBook.abbrev,
        selectedChapter,
        selectedVerse.number,
        color
      );

      // Atualizar highlights local
      await loadHighlightsForChapter(selectedBook.abbrev, selectedChapter);
      setShowVerseMenu(false);

      Alert.alert('✅ Destaque adicionado', 'Versículo destacado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar destaque');
    }
  };

  const handleRemoveHighlight = async () => {
    if (!selectedVerse || !selectedBook) return;

    try {
      await HighlightsService.removeHighlight(
        selectedBook.abbrev,
        selectedChapter,
        selectedVerse.number
      );

      await loadHighlightsForChapter(selectedBook.abbrev, selectedChapter);
      setShowVerseMenu(false);

      Alert.alert('✅ Destaque removido', 'Destaque removido com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover destaque');
    }
  };

  const handleAskAI = async () => {
    if (!selectedVerse || !selectedBook) return;

    setShowVerseMenu(false);

    Alert.prompt(
      '💬 Perguntar à IA',
      'O que você gostaria de saber sobre este versículo?',
      async (question) => {
        if (!question) return;

        try {
          setLoading(true);
          const prompt = `Sobre o versículo "${selectedVerse.text}" (${selectedBook.name} ${selectedChapter}:${selectedVerse.number}), responda: ${question}`;

          const response = await OpenAIService.generateSermon(prompt);

          Alert.alert(
            '🤖 Resposta da IA',
            response,
            [{ text: 'OK' }],
            { cancelable: true }
          );
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível obter resposta da IA');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleHistoricalContext = () => {
    if (!selectedVerse || !selectedBook) return;

    setShowVerseMenu(false);

    const verseReference = `${selectedBook.name} ${selectedChapter}:${selectedVerse.number} - "${selectedVerse.text}"`;

    navigation.navigate('HistoricalContext', {
      initialVerse: verseReference,
    });
  };

  const handleWordAnalysis = () => {
    if (!selectedVerse) return;

    setShowVerseMenu(false);

    Alert.prompt(
      '📖 Análise de Palavra',
      'Digite a palavra que deseja analisar:',
      async (word) => {
        if (!word) return;

        try {
          setLoading(true);
          const prompt = `Analise a palavra "${word}" no contexto bíblico. Explique seu significado original (hebraico/grego), uso nas Escrituras e aplicação prática.`;

          const response = await OpenAIService.generateSermon(prompt);

          Alert.alert(
            `📖 Análise: "${word}"`,
            response,
            [{ text: 'OK' }],
            { cancelable: true }
          );
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível analisar a palavra');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleCopyVerse = () => {
    if (!selectedVerse || !selectedBook) return;

    const verseText = `"${selectedVerse.text}" - ${selectedBook.name} ${selectedChapter}:${selectedVerse.number}`;

    // TODO: Implement clipboard copy when react-native-clipboard is available
    Alert.alert('✅ Copiado', 'Versículo copiado para a área de transferência');
    setShowVerseMenu(false);
  };

  const handleShare = () => {
    if (!selectedVerse || !selectedBook) return;

    const verseText = `"${selectedVerse.text}" - ${selectedBook.name} ${selectedChapter}:${selectedVerse.number}`;

    // TODO: Implement share when react-native-share is available
    Alert.alert('✅ Compartilhar', 'Funcionalidade de compartilhamento em breve!');
    setShowVerseMenu(false);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowBookSelector(false);
    loadChapter(book.abbrev, 1);
  };

  const handleChapterSelect = (chapter) => {
    setShowChapterSelector(false);
    if (selectedBook) {
      loadChapter(selectedBook.abbrev, chapter);
    }
  };

  const goToPreviousChapter = () => {
    if (!selectedBook) return;

    if (selectedChapter > 1) {
      loadChapter(selectedBook.abbrev, selectedChapter - 1);
    } else {
      // Ir para o último capítulo do livro anterior
      const books = BibleService.getAllBooks();
      const currentIndex = books.findIndex(b => b.abbrev === selectedBook.abbrev);
      if (currentIndex > 0) {
        const previousBook = books[currentIndex - 1];
        setSelectedBook(previousBook);
        loadChapter(previousBook.abbrev, previousBook.chapters);
      }
    }
  };

  const goToNextChapter = () => {
    if (!selectedBook) return;

    if (selectedChapter < selectedBook.chapters) {
      loadChapter(selectedBook.abbrev, selectedChapter + 1);
    } else {
      // Ir para o primeiro capítulo do próximo livro
      const books = BibleService.getAllBooks();
      const currentIndex = books.findIndex(b => b.abbrev === selectedBook.abbrev);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        setSelectedBook(nextBook);
        loadChapter(nextBook.abbrev, 1);
      }
    }
  };

  const renderBookSelector = () => {
    const oldTestament = BibleService.getOldTestamentBooks();
    const newTestament = BibleService.getNewTestamentBooks();

    return (
      <Modal
        visible={showBookSelector}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Livro</Text>
              <TouchableOpacity onPress={() => setShowBookSelector(false)}>
                <Icon name="close" size={24} color={colors.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.testamentTitle}>Antigo Testamento</Text>
              <View style={styles.booksGrid}>
                {oldTestament.map(book => (
                  <TouchableOpacity
                    key={book.abbrev}
                    style={[
                      styles.bookChip,
                      selectedBook?.abbrev === book.abbrev && styles.bookChipSelected,
                    ]}
                    onPress={() => handleBookSelect(book)}
                  >
                    <Text
                      style={[
                        styles.bookChipText,
                        selectedBook?.abbrev === book.abbrev && styles.bookChipTextSelected,
                      ]}
                    >
                      {book.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.testamentTitle}>Novo Testamento</Text>
              <View style={styles.booksGrid}>
                {newTestament.map(book => (
                  <TouchableOpacity
                    key={book.abbrev}
                    style={[
                      styles.bookChip,
                      selectedBook?.abbrev === book.abbrev && styles.bookChipSelected,
                    ]}
                    onPress={() => handleBookSelect(book)}
                  >
                    <Text
                      style={[
                        styles.bookChipText,
                        selectedBook?.abbrev === book.abbrev && styles.bookChipTextSelected,
                      ]}
                    >
                      {book.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderChapterSelector = () => {
    if (!selectedBook) return null;

    const chapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);

    return (
      <Modal
        visible={showChapterSelector}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChapterSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Capítulo</Text>
              <TouchableOpacity onPress={() => setShowChapterSelector(false)}>
                <Icon name="close" size={24} color={colors.slate[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.chaptersGrid}>
                {chapters.map(chapter => (
                  <TouchableOpacity
                    key={chapter}
                    style={[
                      styles.chapterChip,
                      selectedChapter === chapter && styles.chapterChipSelected,
                    ]}
                    onPress={() => handleChapterSelect(chapter)}
                  >
                    <Text
                      style={[
                        styles.chapterChipText,
                        selectedChapter === chapter && styles.chapterChipTextSelected,
                      ]}
                    >
                      {chapter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const handleAddNote = () => {
    if (!selectedVerse || !selectedBook) return;

    setShowVerseMenu(false);

    Alert.prompt(
      '📝 Adicionar Anotação',
      `${selectedBook.name} ${selectedChapter}:${selectedVerse.number}`,
      async (note) => {
        if (!note) return;

        try {
          // Primeiro garante que o versículo está destacado (amarelo por padrão)
          const currentHighlight = highlights[selectedVerse.number];
          const color = currentHighlight ? currentHighlight.color : 'yellow';

          await HighlightsService.addHighlight(
            selectedBook.abbrev,
            selectedChapter,
            selectedVerse.number,
            color,
            note
          );

          await loadHighlightsForChapter(selectedBook.abbrev, selectedChapter);
          Alert.alert('✅ Anotação salva', 'Sua anotação foi salva com sucesso!');
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível salvar a anotação');
        }
      }
    );
  };

  const renderVerseMenu = () => {
    if (!selectedVerse || !selectedBook) return null;

    const currentHighlight = highlights[selectedVerse.number];
    const colorOptions = Object.keys(HIGHLIGHT_COLORS);
    const hasNote = currentHighlight?.note && currentHighlight.note.trim().length > 0;

    return (
      <Modal
        visible={showVerseMenu}
        animationType="slide"
        transparent
        onRequestClose={() => setShowVerseMenu(false)}
      >
        <TouchableOpacity
          style={styles.verseMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowVerseMenu(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.verseMenuContainer}>
              {/* Handle bar */}
              <View style={styles.verseMenuHandle} />

              {/* Verse reference */}
              <View style={styles.verseMenuHeader}>
                <Text style={styles.verseMenuReference}>
                  {selectedBook.name} {selectedChapter}:{selectedVerse.number}
                </Text>
                <Text style={styles.verseMenuText} numberOfLines={2}>
                  {selectedVerse.text}
                </Text>
                {hasNote && (
                  <View style={styles.notePreview}>
                    <Icon name="note-text" size={14} color={colors.primary[600]} />
                    <Text style={styles.notePreviewText} numberOfLines={2}>
                      {currentHighlight.note}
                    </Text>
                  </View>
                )}
              </View>

              {/* Color selection */}
              <View style={styles.verseMenuSection}>
                <Text style={styles.verseMenuSectionTitle}>Destacar com cor:</Text>
                <View style={styles.colorOptionsContainer}>
                  {colorOptions.map(colorKey => {
                    const colorData = HIGHLIGHT_COLORS[colorKey];
                    return (
                      <TouchableOpacity
                        key={colorKey}
                        style={[
                          styles.colorOption,
                          { backgroundColor: colorData.color },
                          currentHighlight?.color === colorKey && styles.colorOptionSelected,
                        ]}
                        onPress={() => handleHighlight(colorKey)}
                      >
                        {currentHighlight?.color === colorKey && (
                          <Icon name="check" size={16} color={colorData.textColor} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Action buttons */}
              <View style={styles.verseMenuActions}>
                <TouchableOpacity
                  style={styles.verseMenuButton}
                  onPress={handleAddNote}
                >
                  <Icon name="note-text-outline" size={20} color={colors.slate[700]} />
                  <Text style={styles.verseMenuButtonText}>Anotação</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.verseMenuButton}
                  onPress={handleAskAI}
                >
                  <Icon name="robot-outline" size={20} color={colors.slate[700]} />
                  <Text style={styles.verseMenuButtonText}>Perguntar IA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.verseMenuButton}
                  onPress={handleHistoricalContext}
                >
                  <Icon name="clock-outline" size={20} color={colors.slate[700]} />
                  <Text style={styles.verseMenuButtonText}>Contexto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.verseMenuButton}
                  onPress={handleWordAnalysis}
                >
                  <Icon name="book-alphabet" size={20} color={colors.slate[700]} />
                  <Text style={styles.verseMenuButtonText}>Palavra</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.verseMenuButton}
                  onPress={handleCopyVerse}
                >
                  <Icon name="content-copy" size={20} color={colors.slate[700]} />
                  <Text style={styles.verseMenuButtonText}>Copiar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.verseMenuButton}
                  onPress={handleShare}
                >
                  <Icon name="share-variant" size={20} color={colors.slate[700]} />
                  <Text style={styles.verseMenuButtonText}>Compartilhar</Text>
                </TouchableOpacity>
              </View>

              {/* Remove highlight button if verse is already highlighted */}
              {currentHighlight && (
                <TouchableOpacity
                  style={styles.removeHighlightButton}
                  onPress={handleRemoveHighlight}
                >
                  <Icon name="eraser" size={18} color={colors.red[600]} />
                  <Text style={styles.removeHighlightText}>Remover Destaque</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Icon name="book-open-variant" size={28} color={colors.primary[600]} />
            <Text style={styles.headerTitle}>Bíblia Sagrada</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowSearchBar(!showSearchBar)}
            >
              <Icon name="magnify" size={20} color={colors.slate[600]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              <Icon name="format-font-size-decrease" size={20} color={colors.slate[600]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Icon name="format-font-size-increase" size={20} color={colors.slate[600]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerSelector}>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowBookSelector(true)}
          >
            <Text style={styles.selectorText}>{selectedBook?.name || 'Selecione'}</Text>
            <Icon name="chevron-down" size={20} color={colors.primary[600]} />
          </TouchableOpacity>

          <View style={styles.selectorDivider} />

          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowChapterSelector(true)}
          >
            <Text style={styles.selectorText}>Cap. {selectedChapter}</Text>
            <Icon name="chevron-down" size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </Surface>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color={colors.red[500]} />
          <Text style={styles.errorTitle}>Erro ao carregar</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {error.includes('20 requisições') && (
            <View style={styles.errorHelp}>
              <Text style={styles.errorHelpTitle}>💡 Dica:</Text>
              <Text style={styles.errorHelpText}>
                Os capítulos já lidos ficam salvos no cache e podem ser acessados offline.
              </Text>
              <Text style={styles.errorHelpText}>
                Para uso ilimitado, obtenha um token grátis em: www.abibliadigital.com.br
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => selectedBook && loadChapter(selectedBook.abbrev, selectedChapter)}
          >
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.retryButtonGradient}
            >
              <Icon name="refresh" size={20} color={colors.white} />
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : chapterData ? (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
        >
          {chapterData.verses.map((verse, index) => {
            const highlight = highlights[verse.number];
            const highlightColor = highlight ? HIGHLIGHT_COLORS[highlight.color] : null;
            const hasNote = highlight?.note && highlight.note.trim().length > 0;

            return (
              <TouchableOpacity
                key={verse.number}
                onPress={() => handleVersePress(verse)}
                activeOpacity={0.7}
              >
                <Animated.View
                  entering={FadeInDown.delay(index * 50).duration(400)}
                  style={[
                    styles.verseContainer,
                    highlightColor && {
                      backgroundColor: highlightColor.color,
                      borderLeftWidth: 4,
                      borderLeftColor: highlightColor.textColor,
                      paddingLeft: 12,
                      borderRadius: 8,
                      marginVertical: 4,
                    },
                  ]}
                >
                  <Text style={[
                    styles.verseNumber,
                    highlightColor && { color: highlightColor.textColor }
                  ]}>
                    {verse.number}
                  </Text>
                  <View style={styles.verseTextContainer}>
                    <Text style={[
                      styles.verseText,
                      { fontSize },
                      highlightColor && { color: highlightColor.textColor }
                    ]}>
                      {verse.text}
                    </Text>
                    {hasNote && (
                      <Icon
                        name="note-text"
                        size={16}
                        color={highlightColor ? highlightColor.textColor : colors.primary[600]}
                        style={styles.noteIcon}
                      />
                    )}
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToPreviousChapter}
            >
              <Icon name="chevron-left" size={20} color={colors.white} />
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={goToNextChapter}
            >
              <Text style={styles.navButtonText}>Próximo</Text>
              <Icon name="chevron-right" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}

      {renderBookSelector()}
      {renderChapterSelector()}
      {renderVerseMenu()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.slate[900],
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  headerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[700],
  },
  selectorDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.slate[200],
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[600],
    marginTop: 2,
  },
  verseTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    color: colors.slate[800],
    lineHeight: 24,
  },
  noteIcon: {
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.slate[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.slate[900],
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.slate[600],
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  errorHelp: {
    backgroundColor: colors.blue[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue[500],
  },
  errorHelpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue[900],
    marginBottom: 8,
  },
  errorHelpText: {
    fontSize: 13,
    color: colors.blue[700],
    lineHeight: 18,
    marginTop: 4,
  },
  retryButton: {
    marginTop: 20,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary[600],
    paddingVertical: 14,
    borderRadius: 12,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.slate[900],
  },
  modalContent: {
    padding: 20,
  },
  testamentTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.slate[900],
    marginTop: 16,
    marginBottom: 12,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bookChip: {
    backgroundColor: colors.slate[100],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  bookChipSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  bookChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[700],
  },
  bookChipTextSelected: {
    color: colors.white,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chapterChip: {
    backgroundColor: colors.slate[100],
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  chapterChipSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  chapterChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate[700],
  },
  chapterChipTextSelected: {
    color: colors.white,
  },
  verseMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  verseMenuContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  verseMenuHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.slate[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  verseMenuHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[200],
  },
  verseMenuReference: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary[700],
    marginBottom: 8,
  },
  verseMenuText: {
    fontSize: 14,
    color: colors.slate[700],
    lineHeight: 20,
  },
  notePreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[600],
  },
  notePreviewText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary[800],
    fontStyle: 'italic',
    lineHeight: 18,
  },
  verseMenuSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[200],
  },
  verseMenuSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate[600],
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.primary[600],
    borderWidth: 3,
  },
  verseMenuActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  verseMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.slate[100],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  verseMenuButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[700],
  },
  removeHighlightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.red[50],
    borderWidth: 1,
    borderColor: colors.red[200],
  },
  removeHighlightText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.red[600],
  },
});

export default BibleScreen;
