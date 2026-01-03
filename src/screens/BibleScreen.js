import React, { useState, useEffect } from 'react';
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
import BibleService from '../services/BibleService';

const BibleScreen = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modais
  const [showBookModal, setShowBookModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [searchBook, setSearchBook] = useState('');

  // Carregar livros ao iniciar
  useEffect(() => {
    loadBooks();
  }, []);

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
    book.name.toLowerCase().includes(searchBook.toLowerCase())
  );

  // Separar por testamento
  const oldTestament = filteredBooks.filter(b => b.testament === 'VT');
  const newTestament = filteredBooks.filter(b => b.testament === 'NT');

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
        <ScrollView style={styles.versesContainer}>
          {verses.map((verse) => (
            <View key={verse.id} style={styles.verseRow}>
              <Text style={styles.verseNumber}>{verse.verse}</Text>
              <Text style={styles.verseText}>{verse.text}</Text>
            </View>
          ))}
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
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    width: 36,
    textAlign: 'right',
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: '#1e293b',
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
});

export default BibleScreen;