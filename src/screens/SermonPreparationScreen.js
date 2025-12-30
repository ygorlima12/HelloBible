import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import OpenAIService from '../services/OpenAIService';
import SermonService from '../services/SermonService';

const SermonPreparationScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'saved'
  const [theme, setTheme] = useState('');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [sermon, setSermon] = useState(null);
  const [savedSermons, setSavedSermons] = useState([]);

  useEffect(() => {
    loadSavedSermons();
  }, []);

  const loadSavedSermons = async () => {
    const sermons = await SermonService.getAllSermons();
    setSavedSermons(sermons);
  };

  const handleGenerateSermon = async () => {
    if (!theme.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um tema para o sermão');
      return;
    }

    const hasKey = await OpenAIService.hasApiKey();
    if (!hasKey) {
      Alert.alert(
        'Configuração Necessária',
        'Configure sua chave da OpenAI primeiro. Toque no ícone de chat flutuante para configurar.'
      );
      return;
    }

    setLoading(true);
    try {
      const prompt = buildSermonPrompt();
      const response = await OpenAIService.generateSermon(prompt);

      setSermon({
        theme,
        idea,
        content: response,
      });
    } catch (error) {
      console.error('Error generating sermon:', error);
      Alert.alert('Erro', 'Não foi possível gerar o sermão. Verifique sua chave da API e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buildSermonPrompt = () => {
    let prompt = `Crie um sermão completo e bem estruturado sobre o tema: "${theme}".\n\n`;

    if (idea.trim()) {
      prompt += `Ideias/Direcionamento: ${idea}\n\n`;
    }

    prompt += `O sermão deve incluir:\n`;
    prompt += `1. INTRODUÇÃO: Uma introdução cativante com ilustração ou gancho\n`;
    prompt += `2. CONTEXTO BÍBLICO: Contexto histórico e cultural relevante\n`;
    prompt += `3. DESENVOLVIMENTO: 3-4 pontos principais bem desenvolvidos\n`;
    prompt += `4. APLICAÇÕES PRÁTICAS: Aplicações concretas para a vida\n`;
    prompt += `5. ILUSTRAÇÕES: Exemplos e histórias relevantes\n`;
    prompt += `6. CONCLUSÃO: Uma conclusão impactante\n`;
    prompt += `7. APELO: Um chamado à ação final\n\n`;
    prompt += `Use linguagem clara, pastoral e profunda. Cite referências bíblicas relevantes.`;

    return prompt;
  };

  const handleSaveSermon = async () => {
    try {
      await SermonService.saveSermon(sermon);
      Alert.alert('Sucesso', 'Sermão salvo com sucesso!');
      loadSavedSermons();
      setActiveTab('saved');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o sermão');
    }
  };

  const handleCopySermon = () => {
    Clipboard.setString(sermon.content);
    Alert.alert('Copiado!', 'Sermão copiado para a área de transferência');
  };

  const handleShareSermon = async () => {
    try {
      await Share.share({
        message: `**${sermon.theme}**\n\n${sermon.content}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleNewSermon = () => {
    setSermon(null);
    setTheme('');
    setIdea('');
    setActiveTab('new');
  };

  const handleDeleteSermon = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este sermão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await SermonService.deleteSermon(id);
            loadSavedSermons();
          },
        },
      ]
    );
  };

  const handleViewSavedSermon = (savedSermon) => {
    setSermon(savedSermon);
    setTheme(savedSermon.theme);
    setIdea(savedSermon.idea || '');
  };

  const renderFormattedSermon = () => {
    if (!sermon) return null;

    const sections = SermonService.parseSermonContent(sermon.content);

    return (
      <View style={styles.sermonContainer}>
        <View style={styles.sermonHeader}>
          <View style={styles.sermonHeaderLeft}>
            <Icon name="check-circle" size={24} color={colors.success} />
            <Text style={styles.sermonHeaderText}>Sermão Gerado!</Text>
          </View>
          <TouchableOpacity onPress={handleSaveSermon} style={styles.saveButton}>
            <Icon name="content-save" size={20} color={colors.primary[600]} />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sermonContent} showsVerticalScrollIndicator={false}>
          <Surface style={styles.themeCard} elevation={0}>
            <Text style={styles.sermonTheme}>{sermon.theme}</Text>
            {sermon.idea && <Text style={styles.sermonIdea}>{sermon.idea}</Text>}
          </Surface>

          {sections.map((section, index) => {
            if (section.type === 'title') {
              return (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(index * 50).duration(400)}
                  style={styles.sectionTitle}
                >
                  <View style={styles.sectionTitleLine} />
                  <Text style={styles.sectionTitleText}>{section.content}</Text>
                </Animated.View>
              );
            } else if (section.type === 'list') {
              return (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(index * 50).duration(400)}
                  style={styles.listContainer}
                >
                  {section.content.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                      <View style={styles.listBullet} />
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                </Animated.View>
              );
            } else {
              return (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(index * 50).duration(400)}
                >
                  <Text style={styles.paragraphText}>{section.content.join(' ')}</Text>
                </Animated.View>
              );
            }
          })}
        </ScrollView>

        <View style={styles.sermonActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopySermon}>
            <Icon name="content-copy" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Copiar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShareSermon}>
            <Icon name="share-variant" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleNewSermon}>
            <Icon name="plus" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderNewSermonTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.label}>Tema do Sermão *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: O amor de Deus, Fé em tempos difíceis..."
          value={theme}
          onChangeText={setTheme}
          placeholderTextColor={colors.slate[400]}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Sua Ideia ou Direcionamento (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva sua ideia inicial, versículos que deseja usar, público-alvo, etc..."
          value={idea}
          onChangeText={setIdea}
          multiline
          numberOfLines={5}
          placeholderTextColor={colors.slate[400]}
        />
      </View>

      <TouchableOpacity
        style={styles.generateButtonWrapper}
        onPress={handleGenerateSermon}
        disabled={loading}
      >
        <LinearGradient colors={['#3b82f6', '#4f46e5']} style={styles.generateButton}>
          {loading ? (
            <>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.generateButtonText}>Gerando...</Text>
            </>
          ) : (
            <>
              <Icon name="sparkles" size={24} color={colors.white} />
              <Text style={styles.generateButtonText}>Gerar Sermão com IA</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Surface style={styles.infoCard} elevation={0}>
        <Icon name="information" size={20} color={colors.primary[600]} />
        <Text style={styles.infoText}>
          A IA criará um sermão completo e estruturado baseado no tema e suas ideias.
          Você pode editar e personalizar depois.
        </Text>
      </Surface>
    </ScrollView>
  );

  const renderSavedSermonsTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {savedSermons.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="text-box-outline" size={64} color={colors.slate[300]} />
          <Text style={styles.emptyStateTitle}>Nenhum sermão salvo</Text>
          <Text style={styles.emptyStateText}>
            Crie seu primeiro sermão na aba "Novo Sermão"
          </Text>
        </View>
      ) : (
        savedSermons.map((savedSermon, index) => (
          <Animated.View
            key={savedSermon.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
          >
            <TouchableOpacity
              style={styles.sermonCard}
              onPress={() => handleViewSavedSermon(savedSermon)}
            >
              <View style={styles.sermonCardHeader}>
                <Icon name="text-box" size={24} color={colors.primary[600]} />
                <View style={styles.sermonCardInfo}>
                  <Text style={styles.sermonCardTitle} numberOfLines={1}>
                    {savedSermon.theme}
                  </Text>
                  <Text style={styles.sermonCardDate}>
                    {new Date(savedSermon.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>

              {savedSermon.idea && (
                <Text style={styles.sermonCardIdea} numberOfLines={2}>
                  {savedSermon.idea}
                </Text>
              )}

              <View style={styles.sermonCardActions}>
                <TouchableOpacity
                  style={styles.sermonCardAction}
                  onPress={() => handleDeleteSermon(savedSermon.id)}
                >
                  <Icon name="delete" size={18} color={colors.error} />
                </TouchableOpacity>
                <Icon name="chevron-right" size={20} color={colors.slate[400]} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))
      )}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#3b82f6', '#4f46e5']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Icon name="microphone" size={32} color={colors.white} />
          <Text style={styles.headerTitle}>Preparar Sermão</Text>
          <Text style={styles.headerSubtitle}>IA ajuda você a criar sermões impactantes</Text>
        </View>

        {!sermon && (
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'new' && styles.tabActive]}
              onPress={() => setActiveTab('new')}
            >
              <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
                Novo Sermão
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
              onPress={() => setActiveTab('saved')}
            >
              <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
                Meus Sermões
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {sermon ? renderFormattedSermon() : activeTab === 'new' ? renderNewSermonTab() : renderSavedSermonsTab()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  tabTextActive: {
    color: colors.primary[700],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
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
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  generateButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.primary[700],
    lineHeight: 18,
  },
  sermonContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sermonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[200],
  },
  sermonHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sermonHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  sermonContent: {
    flex: 1,
    padding: 20,
  },
  themeCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sermonTheme: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary[900],
    marginBottom: 4,
  },
  sermonIdea: {
    fontSize: 13,
    color: colors.primary[700],
    opacity: 0.8,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleLine: {
    height: 3,
    backgroundColor: colors.primary[600],
    borderRadius: 2,
    width: 40,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.slate[900],
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[600],
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.slate[700],
  },
  paragraphText: {
    fontSize: 15,
    lineHeight: 26,
    color: colors.slate[800],
    marginBottom: 16,
  },
  sermonActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary[50],
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[700],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.slate[500],
    textAlign: 'center',
  },
  sermonCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  sermonCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  sermonCardInfo: {
    flex: 1,
  },
  sermonCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 4,
  },
  sermonCardDate: {
    fontSize: 12,
    color: colors.slate[500],
  },
  sermonCardIdea: {
    fontSize: 13,
    color: colors.slate[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  sermonCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.slate[100],
    paddingTop: 12,
  },
  sermonCardAction: {
    padding: 4,
  },
});

export default SermonPreparationScreen;
