import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import OpenAIService from '../services/OpenAIService';

const BiblicalDictionaryScreen = ({ navigation }) => {
  const [word, setWord] = useState('');
  const [verseContext, setVerseContext] = useState('');
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!word.trim()) {
      Alert.alert('Atenção', 'Por favor, insira uma palavra para pesquisar');
      return;
    }

    const hasKey = await OpenAIService.hasApiKey();
    if (!hasKey) {
      Alert.alert(
        'Configuração Necessária',
        'Configure sua chave da API OpenAI nas configurações do perfil para usar esta ferramenta.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const contextPart = verseContext.trim() 
        ? `\n\nContexto do versículo: "${verseContext}"`
        : '';

      const prompt = `Forneça uma explicação detalhada sobre a palavra "${word}" no contexto bíblico.${contextPart}

Por favor, inclua:
1. **Palavra Original**: A palavra em hebraico (Antigo Testamento) ou grego (Novo Testamento), com transliteração
2. **Significado Literal**: O significado original da palavra
3. **Uso Bíblico**: Como essa palavra é usada nas Escrituras
4. **Nuances e Contexto**: Significados mais profundos, conotações culturais
5. **Aplicação**: Como entender essa palavra enriquece nossa compreensão

Use formatação clara com títulos e parágrafos.`;

      const result = await OpenAIService.generateSermon(prompt);
      
      setDefinition({
        word: word,
        verseContext: verseContext,
        content: result,
        createdAt: new Date().toLocaleString('pt-BR'),
      });
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao buscar definição');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setDefinition(null);
    setWord('');
    setVerseContext('');
  };

  const renderFormattedDefinition = () => {
    if (!definition) return null;

    const lines = definition.content.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = { type: 'paragraph', content: [] };

    lines.forEach(line => {
      const trimmedLine = line.trim();

      // Detectar títulos (markdown ### ou **negrito** ou termina com :)
      if (trimmedLine.startsWith('###') ||
          trimmedLine.startsWith('##') ||
          trimmedLine.startsWith('#') ||
          trimmedLine.endsWith(':') ||
          (trimmedLine.startsWith('**') && trimmedLine.endsWith('**'))) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        // Limpar marcadores de markdown e :
        let titleText = trimmedLine
          .replace(/^#+\s*/, '')
          .replace(/\*\*/g, '')
          .replace(/:$/, '')
          .trim();

        if (titleText) {
          sections.push({
            type: 'title',
            content: titleText
          });
        }
        currentSection = { type: 'paragraph', content: [] };
      }
      // Detectar listas numeradas
      else if (/^\d+\./.test(trimmedLine)) {
        if (currentSection.type !== 'list') {
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          currentSection = { type: 'list', content: [] };
        }
        currentSection.content.push(trimmedLine.replace(/^\d+\.\s*/, ''));
      }
      // Detectar bullet points
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        if (currentSection.type !== 'list') {
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          currentSection = { type: 'list', content: [] };
        }
        currentSection.content.push(trimmedLine.replace(/^[-•]\s*/, ''));
      }
      // Parágrafos normais
      else if (trimmedLine.length > 0) {
        if (currentSection.type !== 'paragraph') {
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          currentSection = { type: 'paragraph', content: [] };
        }
        currentSection.content.push(trimmedLine);
      }
    });

    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    return (
      <ScrollView
        style={styles.resultScrollView}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com palavra */}
        <Surface style={styles.wordCard} elevation={1}>
          <LinearGradient
            colors={['#10b981', '#14b8a6']}
            style={styles.wordIconContainer}
          >
            <Icon name="book-alphabet" size={32} color={colors.white} />
          </LinearGradient>
          <View style={styles.wordInfo}>
            <Text style={styles.wordLabel}>Palavra Consultada</Text>
            <Text style={styles.wordText}>{definition.word}</Text>
            {definition.verseContext ? (
              <Text style={styles.wordContext}>{definition.verseContext}</Text>
            ) : null}
          </View>
        </Surface>

        {/* Conteúdo formatado */}
        <Surface style={styles.definitionCard} elevation={1}>
          {sections.map((section, index) => {
            if (section.type === 'title') {
              return (
                <View key={index} style={styles.sectionTitleContainer}>
                  <View style={styles.sectionLine} />
                  <Text style={styles.sectionTitleText}>{section.content}</Text>
                </View>
              );
            } else if (section.type === 'list') {
              return (
                <View key={index} style={styles.listContainer}>
                  {section.content.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              );
            } else {
              return (
                <Text key={index} style={styles.paragraphText}>
                  {section.content.join(' ')}
                </Text>
              );
            }
          })}
        </Surface>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNewSearch}
          >
            <Icon name="plus-circle" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Nova Consulta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.slate[900]} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dicionário Bíblico</Text>
          <Text style={styles.headerSubtitle}>
            Explore palavras em hebraico e grego
          </Text>
        </View>
      </Surface>

      {!definition ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Text style={styles.label}>Palavra</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: amor, fé, graça, shalom..."
              value={word}
              onChangeText={setWord}
              placeholderTextColor={colors.slate[400]}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(600)}>
            <Text style={styles.label}>
              Versículo ou Contexto <Text style={styles.optional}>(opcional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João 3:16 - Deus amou o mundo..."
              value={verseContext}
              onChangeText={setVerseContext}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.slate[400]}
            />
            <Text style={styles.hint}>
              Adicione um versículo para uma análise mais contextualizada
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <TouchableOpacity
              style={styles.searchButtonWrapper}
              onPress={handleSearch}
              disabled={loading}
            >
              <LinearGradient
                colors={['#10b981', '#14b8a6']}
                style={styles.searchButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Icon name="magnify" size={20} color={colors.white} />
                    <Text style={styles.searchButtonText}>
                      Buscar Significado
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <Surface style={styles.infoCard} elevation={0}>
              <Icon name="information" size={24} color={colors.primary[600]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Como funciona?</Text>
                <Text style={styles.infoText}>
                  A IA busca o significado original da palavra em hebraico ou grego,
                  explicando nuances, contexto cultural e uso nas Escrituras.
                </Text>
              </View>
            </Surface>
          </Animated.View>

          {/* Exemplos */}
          <Animated.View entering={FadeInDown.delay(350).duration(600)}>
            <Text style={styles.examplesTitle}>Exemplos de palavras:</Text>
            <View style={styles.examplesGrid}>
              {['Ágape', 'Shalom', 'Ruach', 'Logos', 'Hesed', 'Pistis'].map((example, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.exampleChip}
                  onPress={() => setWord(example)}
                >
                  <Text style={styles.exampleText}>{example}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      ) : (
        renderFormattedDefinition()
      )}
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
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 8,
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.slate[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.slate[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 8,
  },
  optional: {
    fontWeight: '400',
    color: colors.slate[500],
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.slate[900],
    borderWidth: 1,
    borderColor: colors.slate[200],
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.slate[500],
    marginBottom: 24,
    lineHeight: 18,
  },
  searchButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  infoCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[700],
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.primary[600],
    lineHeight: 18,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 12,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  exampleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[700],
  },
  resultScrollView: {
    flex: 1,
  },
  resultContent: {
    padding: 16,
    paddingBottom: 100,
  },
  wordCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  wordIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  wordLabel: {
    fontSize: 12,
    color: colors.slate[600],
    marginBottom: 4,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.slate[900],
  },
  wordContext: {
    fontSize: 12,
    color: colors.slate[500],
    marginTop: 4,
  },
  definitionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionLine: {
    height: 3,
    backgroundColor: '#10b981',
    width: 40,
    borderRadius: 2,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.slate[900],
  },
  listContainer: {
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginTop: 7,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.slate[700],
    lineHeight: 20,
  },
  paragraphText: {
    fontSize: 14,
    color: colors.slate[700],
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary[600],
  },
});

export default BiblicalDictionaryScreen;
