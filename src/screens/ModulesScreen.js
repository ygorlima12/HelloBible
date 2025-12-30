import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const ModulesScreen = () => {
  const modules = [
    {
      id: 1,
      title: 'Leis de Deus',
      description: 'Explore os fundamentos das leis divinas e seus princípios eternos.',
      icon: 'book-open-variant',
      lessons: 12,
      duration: 180,
      progress: 0.6,
      color: colors.modules.laws,
    },
    {
      id: 2,
      title: 'Saúde e Bem-Estar',
      description: 'Descubra os ensinamentos bíblicos sobre saúde física e espiritual.',
      icon: 'heart-pulse',
      lessons: 8,
      duration: 120,
      progress: 0.3,
      color: colors.modules.health,
    },
    {
      id: 3,
      title: 'Dízimos e Ofertas',
      description: 'Compreenda a importância da mordomia cristã e da generosidade.',
      icon: 'cash-multiple',
      lessons: 6,
      duration: 90,
      progress: 0.8,
      color: colors.modules.tithes,
    },
    {
      id: 4,
      title: 'Profecia Bíblica',
      description: 'Estude as profecias e seu cumprimento ao longo da história.',
      icon: 'crystal-ball',
      lessons: 15,
      duration: 240,
      progress: 0.4,
      color: colors.modules.prophecy,
    },
    {
      id: 5,
      title: 'Família e Relações',
      description: 'Aprenda sobre relacionamentos saudáveis segundo a Bíblia.',
      icon: 'account-group',
      lessons: 10,
      duration: 150,
      progress: 0.5,
      color: colors.modules.family,
    },
    {
      id: 6,
      title: 'Parábolas de Jesus',
      description: 'Mergulhe nas histórias que Jesus usou para ensinar verdades profundas.',
      icon: 'book-heart',
      lessons: 14,
      duration: 210,
      progress: 0.7,
      color: colors.modules.parables,
    },
    {
      id: 7,
      title: 'Reino de Deus',
      description: 'Entenda os princípios e valores do Reino dos Céus.',
      icon: 'crown',
      lessons: 9,
      duration: 135,
      progress: 0.2,
      color: colors.modules.kingdom,
    },
    {
      id: 8,
      title: 'Criação e Natureza',
      description: 'Explore a majestade da criação divina e o cuidado com a Terra.',
      icon: 'earth',
      lessons: 11,
      duration: 165,
      progress: 0.6,
      color: colors.modules.creation,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <Text style={styles.headerTitle}>Módulos de Estudo</Text>
        <Text style={styles.headerSubtitle}>Trilhas de aprendizado guiadas por IA</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.slate[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar módulos..."
            placeholderTextColor={colors.slate[400]}
          />
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modules List */}
        {modules.map((module, index) => (
          <Animated.View
            key={module.id}
            entering={FadeInDown.delay(index * 50).duration(800)}
          >
            <TouchableOpacity
              style={[
                styles.moduleCard,
                {
                  backgroundColor: module.color.bg,
                  borderColor: module.color.border,
                }
              ]}
            >
              <View style={styles.moduleContent}>
                <LinearGradient
                  colors={[module.color.from, module.color.to]}
                  style={styles.moduleIcon}
                >
                  <Icon name={module.icon} size={28} color={colors.white} />
                </LinearGradient>

                <View style={styles.moduleInfo}>
                  <Text style={[styles.moduleTitle, { color: module.color.text }]}>
                    {module.title}
                  </Text>
                  <Text style={styles.moduleDescription} numberOfLines={2}>
                    {module.description}
                  </Text>

                  <View style={styles.moduleMetadata}>
                    <View style={styles.metadataItem}>
                      <Icon name="book-open-page-variant" size={14} color={colors.slate[600]} />
                      <Text style={styles.metadataText}>{module.lessons} lições</Text>
                    </View>
                    <View style={styles.metadataItem}>
                      <Icon name="clock-outline" size={14} color={colors.slate[600]} />
                      <Text style={styles.metadataText}>{module.duration} min</Text>
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${module.progress * 100}%`,
                            backgroundColor: module.color.from,
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: module.color.text }]}>
                      {Math.round(module.progress * 100)}%
                    </Text>
                  </View>
                </View>

                <Icon name="chevron-right" size={24} color={module.color.text} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Achievement Banner */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <LinearGradient
            colors={['#f59e0b', '#f97316']}
            style={styles.achievementBanner}
          >
            <Icon name="trophy" size={40} color={colors.white} />
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Continue assim!</Text>
              <Text style={styles.achievementText}>
                Você está no Top 10% dos estudantes
              </Text>
              <View style={styles.achievementBadges}>
                <View style={styles.achievementBadge}>
                  <Icon name="certificate" size={16} color={colors.white} />
                  <Text style={styles.badgeText}>5 Certificados</Text>
                </View>
                <View style={styles.achievementBadge}>
                  <Icon name="fire" size={16} color={colors.white} />
                  <Text style={styles.badgeText}>7 dias</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.slate[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.slate[900],
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
    gap: 6,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  moduleDescription: {
    fontSize: 13,
    color: colors.slate[600],
    lineHeight: 18,
  },
  moduleMetadata: {
    flexDirection: 'row',
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: colors.slate[600],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.slate[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  achievementBanner: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  achievementBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ModulesScreen;
