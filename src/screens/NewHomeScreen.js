import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Surface, ProgressBar, Avatar, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const NewHomeScreen = ({ navigation }) => {
  const [bookmarks] = useState(3);
  const [streak] = useState(7);
  const [weekProgress] = useState([
    { day: 'Seg', value: 0.6 },
    { day: 'Ter', value: 0.8 },
    { day: 'Qua', value: 0.5 },
    { day: 'Qui', value: 0.9 },
    { day: 'Sex', value: 0.7 },
    { day: 'Sáb', value: 1.0 },
    { day: 'Dom', value: 0.6 },
  ]);

  const featuredModules = [
    { id: 1, title: 'Leis de Deus', icon: 'book-open-variant', progress: 0.6, color: colors.modules.laws },
    { id: 2, title: 'Saúde', icon: 'heart-pulse', progress: 0.3, color: colors.modules.health },
    { id: 3, title: 'Dízimos', icon: 'cash-multiple', progress: 0.8, color: colors.modules.tithes },
    { id: 4, title: 'Profecia', icon: 'crystal-ball', progress: 0.4, color: colors.modules.prophecy },
  ];

  return (
    <View style={styles.container}>
      {/* Header Sticky */}
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="book-cross" size={28} color={colors.primary[600]} />
            <Text style={styles.headerTitle}>BíbliaAI</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.bookmarkBadge}>
              <Icon name="bookmark" size={20} color={colors.primary[600]} />
              <Badge style={styles.badge}>{bookmarks}</Badge>
            </View>
            <Avatar.Text size={36} label="PS" style={styles.avatar} />
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
            <TouchableOpacity style={styles.quickActionItem}>
              <LinearGradient
                colors={['#f59e0b', '#f97316']}
                style={styles.quickActionGradient}
              >
                <Icon name="brain" size={32} color={colors.white} />
                <Text style={styles.quickActionText}>Análise IA</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
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
                <Text style={styles.streakDays}>{streak} dias</Text>
              </View>
            </View>

            <View style={styles.streakBars}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={styles.streakBarContainer}>
                  <View style={[
                    styles.streakBar,
                    i < streak && styles.streakBarActive
                  ]} />
                </View>
              ))}
            </View>
          </Surface>
        </Animated.View>

        {/* Featured Modules */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Módulos em Destaque</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modulesGrid}>
            {featuredModules.map((module, index) => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.moduleCard,
                  { backgroundColor: module.color.bg, borderColor: module.color.border }
                ]}
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
                <Text style={styles.statValue}>38</Text>
                <Text style={styles.statLabel}>Estudos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>340</Text>
                <Text style={styles.statLabel}>Minutos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Certificados</Text>
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
  bookmarkBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primary[600],
  },
  avatar: {
    backgroundColor: colors.primary[100],
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
