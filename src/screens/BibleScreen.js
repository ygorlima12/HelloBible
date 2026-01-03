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
import HighlightsService, { HIGHLIGHT_COLORS } from '../services/HighlightsService';
import OpenAIService from '../services/OpenAIService';

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


  // Estados para versículo selecionado e modal
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showVerseMenu, setShowVerseMenu] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

      const data = await BibleService.getChapter(bookAbbrev, chapter);
      setChapterData(data);
      setSelectedChapter(chapter);
      setError(null);

      // Carregar highlights deste capítulo
      await loadHighlightsForChapter(bookAbbrev, chapter);
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
  verseTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: '#1e293b',
  },
  noteIcon: {
    marginTop: 2,
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