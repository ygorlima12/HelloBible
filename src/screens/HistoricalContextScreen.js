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

const HistoricalContextScreen = ({ navigation }) => {
  const [verse, setVerse] = useState('');
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!verse.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um versículo ou passagem');
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
      const prompt = `Forneça um contexto histórico detalhado para a seguinte passagem bíblica: "${verse}"

Por favor, inclua:
1. **Contexto Histórico**: Época, eventos históricos relevantes, situação política
2. **Contexto Cultural**: Costumes, tradições, práticas da época
3. **Contexto Geográfico**: Localização, geografia, importância do lugar
4. **Contexto Literário**: Onde se encaixa no livro, autor, audiência original
5. **Aplicação Prática**: Como esse contexto nos ajuda a entender melhor a passagem

Use formatação clara com títulos e parágrafos.`;

      const result = await OpenAIService.generateSermon(prompt);
      
      setContext({
        verse: verse,
        content: result,
        createdAt: new Date().toLocaleString('pt-BR'),
      });
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao gerar contexto histórico');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setContext(null);
    setVerse('');
  };

  const renderFormattedContext = () => {
    if (!context) return null;

    const lines = context.content.split('\n').filter(line => line.trim());
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
        {/* Header com versículo */}
        <Surface style={styles.verseCard} elevation={1}>
          <Icon name="book-open-page-variant" size={24} color={colors.primary[600]} />
          <View style={styles.verseInfo}>
            <Text style={styles.verseLabel}>Passagem Consultada</Text>
            <Text style={styles.verseText}>{context.verse}</Text>
          </View>
        </Surface>

        {/* Conteúdo formatado */}
        <Surface style={styles.contextCard} elevation={1}>
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
          <Text style={styles.headerTitle}>Contexto Histórico</Text>
          <Text style={styles.headerSubtitle}>
            Entenda o contexto das escrituras
          </Text>
        </View>
      </Surface>

      {!context ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Text style={styles.label}>Versículo ou Passagem</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João 3:16 ou Gênesis 1:1-5"
              value={verse}
              onChangeText={setVerse}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.slate[400]}
            />
            <Text style={styles.hint}>
              Digite a referência bíblica para conhecer seu contexto histórico,
              cultural e geográfico
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <TouchableOpacity
              style={styles.generateButtonWrapper}
              onPress={handleGenerate}
              disabled={loading}
            >
              <LinearGradient
                colors={['#f59e0b', '#f97316']}
                style={styles.generateButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Icon name="history" size={20} color={colors.white} />
                    <Text style={styles.generateButtonText}>
                      Gerar Contexto Histórico
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
                  A IA analisa o versículo e fornece informações sobre o contexto
                  histórico, cultural, geográfico e literário da passagem.
                </Text>
              </View>
            </Surface>
          </Animated.View>
        </ScrollView>
      ) : (
        renderFormattedContext()
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
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.slate[900],
    borderWidth: 1,
    borderColor: colors.slate[200],
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 13,
    color: colors.slate[500],
    marginBottom: 24,
    lineHeight: 18,
  },
  generateButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  generateButtonText: {
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
  resultScrollView: {
    flex: 1,
  },
  resultContent: {
    padding: 16,
    paddingBottom: 100,
  },
  verseCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  verseInfo: {
    flex: 1,
  },
  verseLabel: {
    fontSize: 12,
    color: colors.slate[600],
    marginBottom: 4,
  },
  verseText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
  },
  contextCard: {
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
    backgroundColor: '#f59e0b',
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
    backgroundColor: '#f59e0b',
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

export default HistoricalContextScreen;
