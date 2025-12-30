import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const SermonScreen = () => {
  const [activeMode, setActiveMode] = useState('templates'); // 'templates' or 'builder'

  const templates = [
    {
      id: 1,
      title: 'Sermão Expositivo',
      description: 'Análise versículo por versículo com contexto histórico e aplicação prática.',
      tags: ['Expositivo', 'Contextual', 'Didático', 'Versículo', 'Análise'],
    },
    {
      id: 2,
      title: 'Mensagem Temática',
      description: 'Abordagem focada em um tema específico com múltiplas referências bíblicas.',
      tags: ['Temático', 'Múltiplas Refs', 'Prático', 'Contemporâneo', 'Aplicável'],
    },
    {
      id: 3,
      title: 'Sermão Narrativo',
      description: 'Conte histórias bíblicas de forma envolvente com lições profundas.',
      tags: ['Narrativo', 'Histórias', 'Envolvente', 'Ilustrativo', 'Emocional'],
    },
    {
      id: 4,
      title: 'Mensagem Evangelística',
      description: 'Pregação focada no evangelho com chamado para decisão e conversão.',
      tags: ['Evangélico', 'Salvação', 'Decisão', 'Chamado', 'Conversão'],
    },
  ];

  const tools = [
    {
      id: 1,
      title: 'Contexto Histórico',
      icon: 'earth',
      color: colors.gradients.info,
    },
    {
      id: 2,
      title: 'Referências Cruzadas',
      icon: 'book-open-variant',
      color: colors.gradients.success,
    },
    {
      id: 3,
      title: 'Ilustrações',
      icon: 'lightbulb-on',
      color: colors.gradients.primary,
    },
    {
      id: 4,
      title: 'Aplicações',
      icon: 'heart',
      color: colors.gradients.warning,
    },
  ];

  const timeline = [
    { period: 'Antigo Testamento', events: [
      { year: '~2000 aC', event: 'Abraão chamado por Deus' },
      { year: '~1446 aC', event: 'Êxodo do Egito' },
      { year: '~1000 aC', event: 'Reino de Davi' },
      { year: '~586 aC', event: 'Exílio Babilônico' },
    ]},
    { period: 'Novo Testamento', events: [
      { year: '~4 aC', event: 'Nascimento de Jesus' },
      { year: '~30 dC', event: 'Ministério de Jesus' },
      { year: '~33 dC', event: 'Crucificação e Ressurreição' },
      { year: '~95 dC', event: 'Apocalipse escrito' },
    ]},
  ];

  const savedSermons = [
    { id: 1, title: 'A Fé que Move Montanhas', date: '15 Dez 2024' },
    { id: 2, title: 'O Amor de Deus', date: '10 Dez 2024' },
    { id: 3, title: 'Vivendo em Santidade', date: '5 Dez 2024' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <Text style={styles.headerTitle}>Preparação de Sermão</Text>
        <Text style={styles.headerSubtitle}>Ferramentas com IA para criar mensagens</Text>
      </Surface>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'templates' && styles.modeButtonActive
          ]}
          onPress={() => setActiveMode('templates')}
        >
          <Icon
            name="file-document-outline"
            size={20}
            color={activeMode === 'templates' ? colors.primary[600] : colors.slate[600]}
          />
          <Text style={[
            styles.modeButtonText,
            activeMode === 'templates' && styles.modeButtonTextActive
          ]}>
            Templates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'builder' && styles.modeButtonActive
          ]}
          onPress={() => setActiveMode('builder')}
        >
          <Icon
            name="lightning-bolt"
            size={20}
            color={activeMode === 'builder' ? colors.primary[600] : colors.slate[600]}
          />
          <Text style={[
            styles.modeButtonText,
            activeMode === 'builder' && styles.modeButtonTextActive
          ]}>
            IA Builder
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeMode === 'templates' ? (
          <>
            {/* Templates List */}
            {templates.map((template, index) => (
              <Animated.View
                key={template.id}
                entering={FadeInDown.delay(index * 50).duration(800)}
              >
                <TouchableOpacity style={styles.templateCard}>
                  <View style={styles.templateIcon}>
                    <Icon name="file-document" size={24} color={colors.primary[600]} />
                  </View>

                  <View style={styles.templateInfo}>
                    <Text style={styles.templateTitle}>{template.title}</Text>
                    <Text style={styles.templateDescription}>{template.description}</Text>

                    <View style={styles.templateTags}>
                      {template.tags.map((tag, i) => (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <Icon name="chevron-right" size={24} color={colors.slate[400]} />
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Timeline */}
            <Animated.View entering={FadeInDown.delay(250).duration(800)}>
              <Text style={styles.sectionTitle}>Linha do Tempo Bíblica</Text>
              {timeline.map((period, index) => (
                <View key={index} style={styles.timelineSection}>
                  <Text style={styles.timelinePeriod}>{period.period}</Text>
                  {period.events.map((event, i) => (
                    <View key={i} style={styles.timelineEvent}>
                      <View style={styles.timelineDot} />
                      <View style={styles.timelineEventContent}>
                        <Text style={styles.timelineYear}>{event.year}</Text>
                        <Text style={styles.timelineEventText}>{event.event}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </Animated.View>
          </>
        ) : (
          <>
            {/* AI Builder */}
            <Animated.View entering={FadeInDown.delay(100).duration(800)}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.builderCard}
              >
                <View style={styles.builderHeader}>
                  <Icon name="lightbulb-on" size={32} color={colors.white} />
                  <Text style={styles.builderTitle}>IA Assistente de Sermão</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tema do Sermão</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: A importância da fé"
                    placeholderTextColor={colors.slate[400]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Texto Base</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Hebreus 11:1"
                    placeholderTextColor={colors.slate[400]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Público-Alvo</Text>
                  <View style={styles.audienceButtons}>
                    <TouchableOpacity style={styles.audienceButton}>
                      <Text style={styles.audienceButtonText}>Jovens</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.audienceButton}>
                      <Text style={styles.audienceButtonText}>Adultos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.audienceButton}>
                      <Text style={styles.audienceButtonText}>Idosos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.audienceButton}>
                      <Text style={styles.audienceButtonText}>Família</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.generateButton}>
                  <LinearGradient
                    colors={[colors.white, colors.slate[100]]}
                    style={styles.generateButtonGradient}
                  >
                    <Icon name="auto-fix" size={20} color={colors.primary[600]} />
                    <Text style={styles.generateButtonText}>Gerar Estrutura com IA</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>

            {/* Tools Grid */}
            <Animated.View entering={FadeInDown.delay(200).duration(800)}>
              <Text style={styles.sectionTitle}>Ferramentas de Estudo</Text>
              <View style={styles.toolsGrid}>
                {tools.map((tool, index) => (
                  <TouchableOpacity
                    key={tool.id}
                    style={styles.toolCard}
                  >
                    <LinearGradient
                      colors={tool.color}
                      style={styles.toolIconContainer}
                    >
                      <Icon name={tool.icon} size={24} color={colors.white} />
                    </LinearGradient>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* Saved Sermons */}
            <Animated.View entering={FadeInDown.delay(300).duration(800)}>
              <Text style={styles.sectionTitle}>Sermões Salvos</Text>
              {savedSermons.map((sermon) => (
                <TouchableOpacity key={sermon.id} style={styles.savedSermonCard}>
                  <Icon name="file-document" size={24} color={colors.primary[600]} />
                  <View style={styles.savedSermonInfo}>
                    <Text style={styles.savedSermonTitle}>{sermon.title}</Text>
                    <Text style={styles.savedSermonDate}>Editado em {sermon.date}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color={colors.slate[400]} />
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        )}
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.slate[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.slate[600],
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  modeButtonActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[600],
  },
  modeButtonTextActive: {
    color: colors.primary[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  templateCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    flex: 1,
    gap: 6,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
  },
  templateDescription: {
    fontSize: 13,
    color: colors.slate[600],
    lineHeight: 18,
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: colors.slate[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.slate[600],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
    marginTop: 16,
    marginBottom: 12,
  },
  timelineSection: {
    marginBottom: 20,
  },
  timelinePeriod: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[600],
    marginBottom: 12,
  },
  timelineEvent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[600],
    marginTop: 4,
  },
  timelineEventContent: {
    flex: 1,
  },
  timelineYear: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate[600],
  },
  timelineEventText: {
    fontSize: 14,
    color: colors.slate[900],
  },
  builderCard: {
    borderRadius: 16,
    padding: 20,
  },
  builderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  builderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.slate[900],
  },
  audienceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  audienceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  audienceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  generateButton: {
    marginTop: 8,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary[600],
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  toolIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[900],
    textAlign: 'center',
  },
  savedSermonCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedSermonInfo: {
    flex: 1,
  },
  savedSermonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.slate[900],
    marginBottom: 4,
  },
  savedSermonDate: {
    fontSize: 12,
    color: colors.slate[600],
  },
});

export default SermonScreen;
