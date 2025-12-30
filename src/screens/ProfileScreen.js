import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Surface, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const skills = [
    { name: 'Hermenêutica', value: 75 },
    { name: 'Homilética', value: 60 },
    { name: 'Grego', value: 40 },
    { name: 'Hebraico', value: 30 },
    { name: 'História', value: 85 },
    { name: 'Teologia', value: 70 },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Mestre',
      icon: 'trophy',
      gradient: ['#eab308', '#f59e0b'],
    },
    {
      id: 2,
      title: 'Leitor',
      icon: 'book-open-variant',
      gradient: ['#3b82f6', '#4f46e5'],
    },
    {
      id: 3,
      title: '7 Dias',
      icon: 'fire',
      gradient: ['#f97316', '#ef4444'],
    },
    {
      id: 4,
      title: 'Expert',
      icon: 'star',
      gradient: ['#a855f7', '#ec4899'],
    },
    {
      id: 5,
      title: 'Premium',
      icon: 'diamond',
      gradient: ['#06b6d4', '#3b82f6'],
    },
    {
      id: 6,
      title: 'Focado',
      icon: 'target',
      gradient: ['#10b981', '#14b8a6'],
    },
  ];

  // Dados do gráfico de pizza (leitura bíblica)
  const booksRead = 39;
  const booksRemaining = 27;
  const totalBooks = 66;
  const readPercentage = (booksRead / totalBooks) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(800)}>
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.userHeader}
          >
            <Avatar.Text
              size={80}
              label="PS"
              style={styles.userAvatar}
            />

            <Text style={styles.userName}>Pastor João Silva</Text>
            <Text style={styles.userBio}>Estudante dedicado há 234 dias</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>89</Text>
                <Text style={styles.statLabel}>Estudos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>1.2k</Text>
                <Text style={styles.statLabel}>Minutos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>15</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Bible Reading Progress */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <Surface style={styles.progressCard} elevation={1}>
            <Text style={styles.cardTitle}>Progresso de Leitura Bíblica</Text>

            <View style={styles.chartContainer}>
              {/* Pie Chart (Donut) */}
              <View style={styles.donutContainer}>
                <View style={styles.donutOuter}>
                  <View style={styles.donutInner}>
                    <Text style={styles.donutPercentage}>{Math.round(readPercentage)}%</Text>
                    <Text style={styles.donutLabel}>Completo</Text>
                  </View>
                </View>
                <View style={[
                  styles.donutFill,
                  { transform: [{ rotate: `${readPercentage * 3.6}deg` }] }
                ]} />
              </View>

              <View style={styles.booksStats}>
                <View style={styles.booksStat}>
                  <View style={[styles.booksIndicator, { backgroundColor: colors.primary[600] }]} />
                  <View>
                    <Text style={styles.booksNumber}>{booksRead}</Text>
                    <Text style={styles.booksLabel}>Livros Lidos</Text>
                  </View>
                </View>
                <View style={styles.booksStat}>
                  <View style={[styles.booksIndicator, { backgroundColor: colors.slate[300] }]} />
                  <View>
                    <Text style={styles.booksNumber}>{booksRemaining}</Text>
                    <Text style={styles.booksLabel}>Faltam</Text>
                  </View>
                </View>
              </View>
            </View>
          </Surface>
        </Animated.View>

        {/* Skills Radar */}
        <Animated.View entering={FadeInDown.delay(300).duration(800)}>
          <Surface style={styles.skillsCard} elevation={1}>
            <Text style={styles.cardTitle}>Habilidades Teológicas</Text>

            <View style={styles.skillsList}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillValue}>{skill.value}%</Text>
                  </View>
                  <View style={styles.skillBarContainer}>
                    <View
                      style={[
                        styles.skillBarFill,
                        { width: `${skill.value}%` }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Surface>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <TouchableOpacity
                key={achievement.id}
                style={styles.achievementCard}
              >
                <LinearGradient
                  colors={achievement.gradient}
                  style={styles.achievementGradient}
                >
                  <Icon name={achievement.icon} size={32} color={colors.white} />
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Settings Button */}
        <Animated.View entering={FadeInDown.delay(500).duration(800)}>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="cog" size={24} color={colors.slate[700]} />
            <Text style={styles.settingsText}>Configurações</Text>
            <Icon name="chevron-right" size={24} color={colors.slate[400]} />
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  userHeader: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    marginTop: 16,
  },
  userBio: {
    fontSize: 13,
    color: colors.primary[100],
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
  donutContainer: {
    width: 160,
    height: 160,
    position: 'relative',
    marginBottom: 24,
  },
  donutOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.slate[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutFill: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 20,
    borderColor: colors.primary[600],
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    top: 0,
    left: 0,
  },
  donutPercentage: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary[600],
  },
  donutLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.slate[600],
  },
  booksStats: {
    flexDirection: 'row',
    gap: 32,
  },
  booksStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  booksIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  booksNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.slate[900],
  },
  booksLabel: {
    fontSize: 12,
    color: colors.slate[600],
  },
  skillsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  skillsList: {
    gap: 16,
  },
  skillItem: {
    gap: 8,
  },
  skillInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[900],
  },
  skillValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary[600],
  },
  skillBarContainer: {
    height: 8,
    backgroundColor: colors.slate[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillBarFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
    marginHorizontal: 16,
    marginBottom: 12,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  achievementCard: {
    width: (width - 44) / 3,
  },
  achievementGradient: {
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  settingsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.slate[900],
  },
});

export default ProfileScreen;
