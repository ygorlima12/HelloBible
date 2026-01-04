import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import ModulesService from '../services/ModulesService';
import GamificationService from '../services/GamificationService';

const ModulesScreen = ({ navigation }) => {
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [gamificationStats, setGamificationStats] = useState(null);
  const [levelInfo, setLevelInfo] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [nextLesson, setNextLesson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const xpToNextLevel = levelInfo?.isMaxLevel
    ? 0
    : Math.max(
        0,
        Math.round((levelInfo?.xpNeeded || 0) - ((levelInfo?.progress || 0) / 100) * (levelInfo?.xpNeeded || 0))
      );

  useEffect(() => {
    loadModules();

    // Recarregar quando a tela ganhar foco
    const unsubscribe = navigation.addListener('focus', loadModules);
    return unsubscribe;
  }, [navigation]);

  const loadModules = async () => {
    const initialized = await GamificationService.initialize();
    const [data, statsData, gamStats, levelData, achievementsData, progress] = await Promise.all([
      ModulesService.getAllModules(),
      ModulesService.getStats(),
      GamificationService.getStats(),
      GamificationService.getLevelInfo(),
      GamificationService.getAllAchievements(),
      ModulesService.getProgress(),
    ]);

    setModules(data);
    setStats(statsData);
    setGamificationStats(gamStats || initialized);
    setLevelInfo(levelData);
    setAchievements(achievementsData);
    setDailyGoals(buildDailyGoals(statsData, gamStats || initialized, levelData));
    setNextLesson(findNextLesson(data, progress));
  };

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const findNextLesson = (allModules, progress) => {
    if (!progress) return null;
    for (const module of allModules) {
      const completedLessons = progress[module.id]?.lessons || [];
      const pendingLesson = module.lessons.find(lesson => !completedLessons.includes(lesson.id));
      if (pendingLesson) {
        return { module, lesson: pendingLesson, completed: completedLessons.length };
      }
    }
    return null;
  };

  const buildDailyGoals = (moduleStats, gameStats, levelData) => {
    const progressPercent = Math.round((moduleStats?.overallProgress || 0) * 100);
    const levelProgress = Math.round(levelData?.progress || 0);
    const xpRemaining = levelData?.isMaxLevel
      ? 0
      : Math.max(
          0,
          Math.round((levelData?.xpNeeded || 0) - ((levelData?.progress || 0) / 100) * (levelData?.xpNeeded || 0))
        );

    return [
      {
        id: 'lesson-today',
        title: 'Complete 1 lição hoje',
        icon: 'target',
        current: gameStats?.dailyLessons || 0,
        target: 1,
        accent: colors.primary[600],
        helper: 'Mantenha o ritmo diário',
      },
      {
        id: 'level-up',
        title: 'Rumo ao próximo nível',
        icon: 'chevron-double-up',
        current: levelProgress,
        target: 100,
        accent: '#f59e0b',
        helper: xpRemaining > 0 ? `Faltam ~${xpRemaining} XP` : 'Pronto para subir!',
        isPercent: true,
      },
      {
        id: 'path',
        title: 'Avance no caminho',
        icon: 'map-marker-path',
        current: progressPercent,
        target: 100,
        accent: '#10b981',
        helper: `${moduleStats?.completedLessons || 0}/${moduleStats?.totalLessons || 0} lições`,
        isPercent: true,
      },
    ];
  };

  const renderGoal = (goal, index) => {
    const progress = Math.min(goal.current / goal.target, 1);
    return (
      <Animated.View key={goal.id} entering={FadeInDown.delay(index * 80).duration(600)}>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={[styles.goalIcon, { backgroundColor: goal.accent + '22' }]}>
              <Icon name={goal.icon} size={18} color={goal.accent} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalHelper}>{goal.helper}</Text>
            </View>
            <Text style={styles.goalValue}>
              {goal.isPercent ? `${Math.round(progress * 100)}%` : `${goal.current}/${goal.target}`}
            </Text>
          </View>
          <View style={styles.goalBar}>
            <View style={[styles.goalBarFill, { width: `${progress * 100}%`, backgroundColor: goal.accent }]} />
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderAchievement = (achievement, index) => (
    <Animated.View key={achievement.id} entering={FadeInDown.delay(index * 60).duration(600)}>
      <View style={[
        styles.achievementChip,
        { opacity: achievement.unlocked ? 1 : 0.4, borderColor: achievement.unlocked ? achievement.color[0] : colors.slate[200] }
      ]}>
        <LinearGradient colors={achievement.color} style={styles.achievementIcon}>
          <Icon name={achievement.icon} size={20} color={colors.white} />
        </LinearGradient>
        <View style={styles.achievementTextWrapper}>
          <Text style={styles.achievementName}>{achievement.title}</Text>
          <Text style={styles.achievementSubtitle}>{achievement.description}</Text>
        </View>
        {achievement.unlocked ? <Icon name="check-circle" size={18} color={colors.success} /> : null}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <Text style={styles.headerTitle}>Módulos de Estudo</Text>
        <Text style={styles.headerSubtitle}>28 Crenças Fundamentais Adventistas</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.slate[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar módulos..."
            placeholderTextColor={colors.slate[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gamified Hero */}
        {gamificationStats && levelInfo && (
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroStreak}>
                <Icon name="fire" size={20} color="#fbbf24" />
                <Text style={styles.heroStreakText}>{gamificationStats.streak || 0} dias de sequência</Text>
              </View>
              <View style={styles.heroLevelPill}>
                <Text style={styles.heroLevelText}>Nível {gamificationStats.level}</Text>
                <Text style={styles.heroLevelTitle}>{levelInfo.title}</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Continue sua jornada!</Text>
            <Text style={styles.heroSubtitle}>
              {levelInfo.isMaxLevel ? 'Você chegou ao topo!' : `Faltam ${xpToNextLevel} XP para o próximo nível`}
            </Text>

            <View style={styles.heroProgressBar}>
              <View style={[styles.heroProgressFill, { width: `${levelInfo.progress}%` }]} />
            </View>
            <View style={styles.heroProgressLabels}>
              <Text style={styles.heroProgressText}>{Math.round(levelInfo.progress)}% do nível</Text>
              <Text style={styles.heroProgressText}>{gamificationStats.totalXP || 0} XP</Text>
            </View>

            {nextLesson && (
              <TouchableOpacity
                style={styles.heroCTA}
                onPress={() =>
                  navigation.navigate('Lesson', {
                    moduleId: nextLesson.module.id,
                    lessonId: nextLesson.lesson.id,
                    moduleColor: nextLesson.module.color,
                  })
                }
              >
                <View style={styles.heroCTATextWrapper}>
                  <Text style={styles.heroCTATitle}>Continuar</Text>
                  <Text style={styles.heroCTASubtitle}>
                    {nextLesson.module.title} • {nextLesson.lesson.title}
                  </Text>
                </View>
                <View style={styles.heroCTAIcon}>
                  <Icon name="arrow-right" size={20} color={colors.primary[600]} />
                </View>
              </TouchableOpacity>
            )}
          </LinearGradient>
        )}

        {/* Daily goals */}
        {dailyGoals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Metas diárias</Text>
              <Text style={styles.sectionSubtitle}>Siga o ritmo e mantenha a chama acesa</Text>
            </View>
            {dailyGoals.map(renderGoal)}
          </View>
        )}

        {/* Module path */}
        {modules.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Caminho dos módulos</Text>
              <Text style={styles.sectionSubtitle}>Suba de nível como no Duolingo</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pathScroll}>
              {modules.map((module, index) => {
                const progressPercent = Math.round(module.progress * 100);
                return (
                  <TouchableOpacity
                    key={module.id}
                    style={[
                      styles.pathNode,
                      {
                        backgroundColor: module.color.bg,
                        borderColor: module.color.border,
                      }
                    ]}
                    onPress={() => navigation.navigate('ModuleDetail', { moduleId: module.id })}
                    activeOpacity={0.9}
                  >
                    <View style={styles.pathBadge}>
                      <Text style={[styles.pathBadgeText, { color: module.color.text }]}>{index + 1}</Text>
                    </View>
                    <View style={[styles.pathIcon, { backgroundColor: module.color.border }]}>
                      <Icon name={module.icon} size={24} color={module.color.text} />
                    </View>
                    <Text style={[styles.pathTitle, { color: module.color.text }]} numberOfLines={2}>
                      {module.title}
                    </Text>
                    <View style={styles.pathProgress}>
                      <View style={[styles.pathProgressFill, { width: `${progressPercent}%`, backgroundColor: module.color.text }]} />
                    </View>
                    <Text style={styles.pathProgressText}>{progressPercent}%</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Modules List */}
        {filteredModules.map((module, index) => (
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
              onPress={() => navigation.navigate('ModuleDetail', { moduleId: module.id })}
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
                      <Text style={styles.metadataText}>{module.totalLessons} lições</Text>
                    </View>
                    <View style={styles.metadataItem}>
                      <Icon name="clock-outline" size={14} color={colors.slate[600]} />
                      <Text style={styles.metadataText}>{module.estimatedTime} min</Text>
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
        {stats && stats.completedLessons > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <LinearGradient
              colors={['#f59e0b', '#f97316']}
              style={styles.achievementBanner}
            >
              <Icon name="trophy" size={40} color={colors.white} />
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Continue assim!</Text>
                <Text style={styles.achievementText}>
                  {stats.completedLessons} lições concluídas
                </Text>
                <View style={styles.achievementBadges}>
                  <View style={styles.achievementBadge}>
                    <Icon name="book-check" size={16} color={colors.white} />
                    <Text style={styles.badgeText}>{stats.completedModules} Módulos</Text>
                  </View>
                  <View style={styles.achievementBadge}>
                    <Icon name="fire" size={16} color={colors.white} />
                    <Text style={styles.badgeText}>{Math.round(stats.overallProgress * 100)}% Completo</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={[styles.section, { marginTop: 12 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conquistas</Text>
              <Text style={styles.sectionSubtitle}>Colecione medalhas à medida que avança</Text>
            </View>
            <View style={styles.achievementList}>
              {achievements.map(renderAchievement)}
            </View>
          </View>
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.slate[900],
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.slate[500],
  },
  heroCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  heroStreakText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  heroLevelPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'flex-end',
  },
  heroLevelText: {
    color: colors.white,
    fontWeight: '800',
  },
  heroLevelTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  heroProgressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: colors.white,
  },
  heroProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroProgressText: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    fontSize: 12,
  },
  heroCTA: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroCTATextWrapper: {
    flex: 1,
  },
  heroCTATitle: {
    fontWeight: '900',
    color: colors.slate[900],
    fontSize: 16,
  },
  heroCTASubtitle: {
    color: colors.slate[600],
    fontSize: 12,
  },
  heroCTAIcon: {
    backgroundColor: colors.slate[100],
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  pathNode: {
    width: 160,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  pathBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  pathBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pathIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  pathTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  pathProgress: {
    height: 8,
    backgroundColor: colors.white,
    borderRadius: 6,
    overflow: 'hidden',
  },
  pathProgressFill: {
    height: '100%',
  },
  pathProgressText: {
    fontSize: 12,
    color: colors.slate[600],
    fontWeight: '700',
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
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.slate[100],
    marginBottom: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
    gap: 2,
  },
  goalTitle: {
    fontWeight: '800',
    color: colors.slate[900],
  },
  goalHelper: {
    fontSize: 12,
    color: colors.slate[500],
  },
  goalValue: {
    fontWeight: '800',
    color: colors.slate[700],
  },
  goalBar: {
    height: 6,
    backgroundColor: colors.slate[100],
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementList: {
    gap: 10,
  },
  achievementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
  },
  achievementIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTextWrapper: {
    flex: 1,
    gap: 4,
  },
  achievementName: {
    fontWeight: '800',
    color: colors.slate[900],
  },
  achievementSubtitle: {
    fontSize: 12,
    color: colors.slate[600],
  },
});

export default ModulesScreen;
