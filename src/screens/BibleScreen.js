import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BibleService from '../services/BibleService';

const BibleScreen = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [fontSize, setFontSize] = useState(16);

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
    } catch (err) {
      console.error('Error loading chapter:', err);
      setError(err.message || 'Erro ao carregar capítulo. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
          {chapterData.verses.map((verse, index) => (
            <Animated.View
              key={verse.number}
              entering={FadeInDown.delay(index * 50).duration(400)}
              style={styles.verseContainer}
            >
              <Text style={styles.verseNumber}>{verse.number}</Text>
              <Text style={[styles.verseText, { fontSize }]}>{verse.text}</Text>
            </Animated.View>
          ))}

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
  verseText: {
    flex: 1,
    fontSize: 16,
    color: colors.slate[800],
    lineHeight: 24,
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
});

export default BibleScreen;
