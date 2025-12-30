import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const StudyToolsScreen = ({ navigation }) => {
  const tools = [
    {
      id: 1,
      title: 'Preparar Sermão',
      description: 'IA ajuda você a criar sermões profundos e impactantes',
      icon: 'microphone',
      gradient: ['#3b82f6', '#4f46e5'],
      screen: 'SermonPreparation',
      premium: false,
    },
    {
      id: 2,
      title: 'Análise Bíblica IA',
      description: 'Entenda passagens complexas com explicações detalhadas',
      icon: 'brain',
      gradient: ['#f59e0b', '#f97316'],
      screen: 'BiblicalAnalysis',
      premium: false,
    },
    {
      id: 3,
      title: 'Gerador de Esboços',
      description: 'Crie esboços estruturados para seus estudos',
      icon: 'format-list-bulleted',
      gradient: ['#10b981', '#14b8a6'],
      screen: 'OutlineGenerator',
      premium: false,
    },
    {
      id: 4,
      title: 'Pesquisa de Versículos',
      description: 'Encontre versículos por tema ou palavra-chave',
      icon: 'magnify',
      gradient: ['#8b5cf6', '#7c3aed'],
      screen: 'VerseSearch',
      premium: false,
    },
    {
      id: 5,
      title: 'Comentário Bíblico',
      description: 'Acesse comentários teológicos de estudiosos',
      icon: 'comment-text',
      gradient: ['#ec4899', '#d946ef'],
      screen: 'Commentary',
      premium: true,
    },
    {
      id: 6,
      title: 'Plano de Estudo',
      description: 'Crie cronogramas personalizados de leitura',
      icon: 'calendar-check',
      gradient: ['#06b6d4', '#0891b2'],
      screen: 'StudyPlan',
      premium: true,
    },
  ];

  const handleToolPress = (tool) => {
    if (tool.screen === 'SermonPreparation') {
      navigation.navigate('SermonPreparation');
    } else {
      // Para as outras ferramentas, mostrar "em breve" ou implementar depois
      alert(`${tool.title} - Em breve!`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="tools" size={28} color={colors.primary[600]} />
            <Text style={styles.headerTitle}>Ferramentas de Estudo</Text>
          </View>
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Recursos avançados para aprofundar seus estudos bíblicos
        </Text>

        {tools.map((tool, index) => (
          <Animated.View
            key={tool.id}
            entering={FadeInDown.delay(index * 100).duration(600)}
          >
            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleToolPress(tool)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={tool.gradient}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name={tool.icon} size={32} color={colors.white} />
              </LinearGradient>

              <View style={styles.toolContent}>
                <View style={styles.toolHeader}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  {tool.premium && (
                    <View style={styles.premiumBadge}>
                      <Icon name="crown" size={14} color="#f59e0b" />
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>

              <Icon name="chevron-right" size={24} color={colors.slate[400]} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)}>
          <Surface style={styles.infoCard} elevation={0}>
            <Icon name="lightbulb-on" size={24} color={colors.primary[600]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Dica Profissional</Text>
              <Text style={styles.infoText}>
                Use a IA para preparar sermões combinando múltiplas passagens e
                temas. Os resultados são surpreendentes!
              </Text>
            </View>
          </Surface>
        </Animated.View>
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
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 14,
    color: colors.slate[600],
    marginBottom: 20,
    lineHeight: 20,
  },
  toolCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolContent: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f59e0b',
  },
  toolDescription: {
    fontSize: 13,
    color: colors.slate[600],
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
});

export default StudyToolsScreen;
