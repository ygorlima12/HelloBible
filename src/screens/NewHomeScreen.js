import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Surface, ProgressBar, Avatar, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import GamificationService from '../services/GamificationService';
import ModulesService from '../services/ModulesService';

const { width } = Dimensions.get('window');

const NewHomeScreen = ({ navigation }) => {
  const [userStats, setUserStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      // Inicializar serviços
      await GamificationService.initialize();

      // Carregar estatísticas do usuário
      const stats = await GamificationService.getStats();

      // Também precisamos dos achievements desbloqueados
      const achievements = await GamificationService.getAllAchievements();
      const unlockedAchievements = achievements.filter(a => a.unlocked);

      setUserStats({
        ...stats,
        achievements: unlockedAchievements,
      });

      // Carregar módulos
      const allModules = await ModulesService.getAllModules();
      setModules(allModules);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular progresso semanal real
  const getWeekProgress = () => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date().getDay(); // 0 = Domingo, 6 = Sábado
    const data = userStats || {};

    // Criar array de 7 dias
    return daysOfWeek.map((day, index) => {
      let value = 0;

      // Apenas o dia de hoje tem progresso se houve atividade
      if (index === today && data.lastActivityDate) {
        const lastActivity = new Date(data.lastActivityDate);
        const todayDate = new Date();

        // Verifica se a última atividade foi hoje
        if (
          lastActivity.getDate() === todayDate.getDate() &&
          lastActivity.getMonth() === todayDate.getMonth() &&
          lastActivity.getFullYear() === todayDate.getFullYear()
        ) {
          // Calcula progresso baseado em lições do dia (máximo 1.0)
          value = Math.min((data.dailyLessons || 0) / 3, 1.0);
        }
      }

      return { day, value };
    });
  };

  const handleModulePress = (moduleId) => {
    navigation.navigate('Módulos', {
      screen: 'ModuleDetail',
      params: { moduleId },
    });
  };

  if (loading || !userStats) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const bookmarks = 3;
  const weekProgress = getWeekProgress();

  return (
    <View style={styles.container}>
      {/* Header Sticky */}
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="book-cross" size={28} color={colors.primary[600]} />
            <Text style={styles.headerTitle}>HelloBible</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.xpBadge}>
              <Icon name="star-circle" size={20} color={colors.primary[600]} />
              <Text style={styles.xpText}>{userStats.totalXP} XP</Text>
            </TouchableOpacity>
            <Avatar.Text
              size={36}
              label={`${userStats.level}`}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
          </View>
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Verse Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(800)}>
          <LinearGradient
            colors={colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Text style={styles.verseText}>
              "Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho."
            </Text>

            <View style={styles.verseActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="volume-high" size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="bookmark-outline" size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-variant" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.verseReference}>Salmos 119:105</Text>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('StudyTools')}
            >
              <LinearGradient
                colors={['#f59e0b', '#f97316']}
                style={styles.quickActionGradient}
              >
                <Icon name="brain" size={32} color={colors.white} />
                <Text style={styles.quickActionText}>Ferramentas IA</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('SermonPreparation')}
            >
              <LinearGradient
                colors={['#3b82f6', '#4f46e5']}
                style={styles.quickActionGradient}
              >
                <Icon name="microphone" size={32} color={colors.white} />
                <Text style={styles.quickActionText}>Preparar Sermão</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Study Streak */}
        <Animated.View entering={FadeInDown.delay(300).duration(800)}>
          <Surface style={styles.streakCard} elevation={1}>
            <View style={styles.streakHeader}>
              <Icon name="fire" size={32} color="#f97316" />
              <View style={styles.streakInfo}>
                <Text style={styles.streakLabel}>Sequência de Estudos</Text>
                <Text style={styles.streakDays}>{userStats.streak} dias</Text>
              </View>
              <View style={styles.levelBadge}>
                <Icon name="trophy" size={16} color={colors.primary[600]} />
                <Text style={styles.levelText}>Nível {userStats.level}</Text>
              </View>
            </View>

            <View style={styles.streakBars}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={styles.streakBarContainer}>
                  <View style={[
                    styles.streakBar,
                    i < userStats.streak && styles.streakBarActive
                  ]} />
                </View>
              ))}
            </View>
          </Surface>
        </Animated.View>

        {/* Featured Modules */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Módulos de Estudo</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Módulos')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modulesGrid}>
            {modules.slice(0, 4).map((module, index) => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.moduleCard,
                  { backgroundColor: module.color.bg, borderColor: module.color.border }
                ]}
                onPress={() => handleModulePress(module.id)}
              >
                <LinearGradient
                  colors={[module.color.from, module.color.to]}
                  style={styles.moduleIconContainer}
                >
                  <Icon name={module.icon} size={24} color={colors.white} />
                </LinearGradient>

                <Text style={[styles.moduleTitle, { color: module.color.text }]}>
                  {module.title}
                </Text>

                <View style={styles.moduleProgress}>
                  <ProgressBar
                    progress={module.progress}
                    color={module.color.from}
                    style={styles.progressBar}
                  />
                  <Text style={[styles.progressText, { color: module.color.text }]}>
                    {Math.round(module.progress * 100)}%
                  </Text>
                </View>

                <View style={styles.moduleMeta}>
                  <Text style={[styles.moduleMetaText, { color: module.color.text }]}>
                    {module.completedLessons}/{module.totalLessons} lições
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View entering={FadeInDown.delay(500).duration(800)}>
          <Surface style={styles.weeklyProgressCard} elevation={1}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progresso Semanal</Text>
              <View style={styles.progressBadge}>
                <Icon name="trending-up" size={16} color={colors.success} />
                <Text style={styles.progressBadgeText}>+15%</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              {weekProgress.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.chartBarTrack}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { height: `${item.value * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{item.day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.lessonsCompleted}</Text>
                <Text style={styles.statLabel}>Lições</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.totalXP}</Text>
                <Text style={styles.statLabel}>XP Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.achievements.length}</Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary[600],
  },
  avatar: {
    backgroundColor: colors.primary[600],
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: '900',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  heroCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  verseText: {
    fontSize: 18,
    fontFamily: 'serif',
    color: colors.white,
    lineHeight: 28,
    marginBottom: 16,
  },
  verseActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionItem: {
    flex: 1,
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  streakCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.slate[600],
  },
  streakDays: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.slate[900],
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[600],
  },
  streakBars: {
    flexDirection: 'row',
    gap: 8,
  },
  streakBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.slate[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  streakBar: {
    height: '100%',
    backgroundColor: colors.slate[200],
    borderRadius: 4,
  },
  streakBarActive: {
    backgroundColor: colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  moduleCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  moduleProgress: {
    gap: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.slate[200],
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  moduleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleMetaText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  weeklyProgressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarTrack: {
    flex: 1,
    width: 16,
    backgroundColor: colors.slate[100],
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: 8,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.slate[600],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.slate[900],
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.slate[600],
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.slate[200],
  },
});

export default NewHomeScreen;
