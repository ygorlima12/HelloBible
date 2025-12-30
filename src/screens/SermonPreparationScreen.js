import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import OpenAIService from '../services/OpenAIService';

const SermonPreparationScreen = ({ navigation }) => {
  const [topic, setTopic] = useState('');
  const [selectedType, setSelectedType] = useState('expositivo');
  const [selectedAudience, setSelectedAudience] = useState('geral');
  const [verses, setVerses] = useState('');
  const [loading, setLoading] = useState(false);
  const [sermon, setSermon] = useState(null);

  const sermonTypes = [
    { id: 'expositivo', label: 'Expositivo', icon: 'book-open-variant' },
    { id: 'tematico', label: 'Temático', icon: 'lightbulb' },
    { id: 'textual', label: 'Textual', icon: 'format-quote-close' },
    { id: 'narrativo', label: 'Narrativo', icon: 'book-open-page-variant' },
  ];

  const audiences = [
    { id: 'geral', label: 'Geral' },
    { id: 'jovens', label: 'Jovens' },
    { id: 'adultos', label: 'Adultos' },
    { id: 'criancas', label: 'Crianças' },
  ];

  const handleGenerateSermon = async () => {
    if (!topic.trim()) {
      alert('Por favor, insira um tema para o sermão');
      return;
    }

    // Verificar se tem chave da API configurada
    const hasKey = await OpenAIService.hasApiKey();
    if (!hasKey) {
      alert('Configure sua chave da OpenAI primeiro nas configurações');
      return;
    }

    setLoading(true);
    try {
      const prompt = buildSermonPrompt();
      const response = await OpenAIService.generateSermon(prompt);

      setSermon(response);
    } catch (error) {
      console.error('Error generating sermon:', error);
      alert('Erro ao gerar sermão. Verifique sua chave da API e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buildSermonPrompt = () => {
    let prompt = `Crie um sermão ${selectedType} sobre o tema: "${topic}".\n\n`;

    if (verses.trim()) {
      prompt += `Texto base: ${verses}\n\n`;
    }

    prompt += `Público-alvo: ${selectedAudience}\n\n`;

    prompt += `O sermão deve incluir:\n`;
    prompt += `1. Introdução cativante\n`;
    prompt += `2. Contexto bíblico e histórico\n`;
    prompt += `3. Pontos principais (3-4 pontos)\n`;
    prompt += `4. Aplicações práticas para a vida\n`;
    prompt += `5. Ilustrações e exemplos\n`;
    prompt += `6. Conclusão impactante\n`;
    prompt += `7. Apelo final\n\n`;

    prompt += `Seja claro, profundo e pastoral. Use linguagem acessível mas teologicamente sólida.`;

    return prompt;
  };

  const renderSermon = () => {
    if (!sermon) return null;

    return (
      <View style={styles.sermonContainer}>
        <View style={styles.sermonHeader}>
          <Icon name="check-circle" size={24} color={colors.success} />
          <Text style={styles.sermonHeaderText}>Sermão Gerado!</Text>
        </View>

        <ScrollView style={styles.sermonContent}>
          <Text style={styles.sermonText}>{sermon}</Text>
        </ScrollView>

        <View style={styles.sermonActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Copiar para clipboard
              alert('Sermão copiado!');
            }}
          >
            <Icon name="content-copy" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Copiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Compartilhar
              alert('Compartilhar sermão');
            }}
          >
            <Icon name="share-variant" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setSermon(null);
              setTopic('');
              setVerses('');
            }}
          >
            <Icon name="refresh" size={20} color={colors.primary[600]} />
            <Text style={styles.actionButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#4f46e5']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Icon name="microphone" size={32} color={colors.white} />
          <Text style={styles.headerTitle}>Preparar Sermão</Text>
          <Text style={styles.headerSubtitle}>
            IA ajuda você a criar sermões impactantes
          </Text>
        </View>
      </LinearGradient>

      {sermon ? (
        renderSermon()
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Topic Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Tema do Sermão *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: O amor de Deus, Fé em tempos difíceis..."
              value={topic}
              onChangeText={setTopic}
              placeholderTextColor={colors.slate[400]}
            />
          </View>

          {/* Verses Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Texto Base (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: João 3:16, Salmos 23..."
              value={verses}
              onChangeText={setVerses}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.slate[400]}
            />
          </View>

          {/* Sermon Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Tipo de Sermão</Text>
            <View style={styles.typeGrid}>
              {sermonTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    selectedType === type.id && styles.typeCardSelected,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Icon
                    name={type.icon}
                    size={24}
                    color={
                      selectedType === type.id
                        ? colors.primary[600]
                        : colors.slate[600]
                    }
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === type.id && styles.typeLabelSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Audience */}
          <View style={styles.section}>
            <Text style={styles.label}>Público-Alvo</Text>
            <View style={styles.chipContainer}>
              {audiences.map((audience) => (
                <Chip
                  key={audience.id}
                  selected={selectedAudience === audience.id}
                  onPress={() => setSelectedAudience(audience.id)}
                  style={[
                    styles.chip,
                    selectedAudience === audience.id && styles.chipSelected,
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedAudience === audience.id && styles.chipTextSelected,
                  ]}
                >
                  {audience.label}
                </Chip>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={styles.generateButtonWrapper}
            onPress={handleGenerateSermon}
            disabled={loading}
          >
            <LinearGradient
              colors={['#3b82f6', '#4f46e5']}
              style={styles.generateButton}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Icon name="sparkles" size={24} color={colors.white} />
                  <Text style={styles.generateButtonText}>Gerar Sermão com IA</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Info */}
          <Surface style={styles.infoCard} elevation={0}>
            <Icon name="information" size={20} color={colors.primary[600]} />
            <Text style={styles.infoText}>
              A IA gerará um sermão completo baseado nas suas escolhas. Você pode
              editar e personalizar depois.
            </Text>
          </Surface>
        </ScrollView>
      )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
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
    height: 80,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.slate[200],
  },
  typeCardSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[600],
  },
  typeLabelSelected: {
    color: colors.primary[700],
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.slate[200],
  },
  chipSelected: {
    backgroundColor: colors.primary[600],
  },
  chipText: {
    color: colors.slate[700],
  },
  chipTextSelected: {
    color: colors.white,
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
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[200],
  },
  sermonHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
  },
  sermonContent: {
    flex: 1,
    padding: 20,
  },
  sermonText: {
    fontSize: 15,
    lineHeight: 26,
    color: colors.slate[800],
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
    gap: 8,
    backgroundColor: colors.primary[50],
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
});

export default SermonPreparationScreen;
