import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import ModulesService from '../services/ModulesService';

const ModuleDetailScreen = ({ route, navigation }) => {
  const { moduleId } = route.params;
  const [module, setModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadModule();
    });
    return unsubscribe;
  }, [navigation]);

  const loadModule = async () => {
    const data = await ModulesService.getModuleById(moduleId);
    setModule(data);

    // Carregar lições completas
    const completed = {};
    for (const lesson of data.lessons) {
      completed[lesson.id] = await ModulesService.isLessonComplete(moduleId, lesson.id);
    }
    setCompletedLessons(completed);
  };

  const handleLessonPress = (lesson) => {
    navigation.navigate('Lesson', {
      moduleId: moduleId,
      lessonId: lesson.id,
      moduleColor: module.color,
    });
  };

  if (!module) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[module.color.from, module.color.to]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Icon name={module.icon} size={48} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>{module.title}</Text>
          <Text style={styles.headerSubtitle}>{module.description}</Text>

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={module.progress}
              color={colors.white}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(module.progress * 100)}% Completo
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{module.completedLessons}/{module.totalLessons}</Text>
              <Text style={styles.statLabel}>Lições</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{module.estimatedTime}</Text>
              <Text style={styles.statLabel}>Minutos</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Lessons List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Lições</Text>

        {module.lessons.map((lesson, index) => (
          <Animated.View
            key={lesson.id}
            entering={FadeInDown.delay(index * 50).duration(800)}
          >
            <TouchableOpacity
              style={styles.lessonCard}
              onPress={() => handleLessonPress(lesson)}
            >
              <View style={styles.lessonNumber}>
                {completedLessons[lesson.id] ? (
                  <Icon name="check-circle" size={32} color={colors.success} />
                ) : (
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                )}
              </View>

              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDescription} numberOfLines={2}>
                  {lesson.description}
                </Text>

                <View style={styles.lessonMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="clock-outline" size={14} color={colors.slate[600]} />
                    <Text style={styles.metaText}>{lesson.duration} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="book-open-variant" size={14} color={colors.slate[600]} />
                    <Text style={styles.metaText}>{lesson.verseReference}</Text>
                  </View>
                </View>
              </View>

              <Icon name="chevron-right" size={24} color={colors.slate[400]} />
            </TouchableOpacity>
          </Animated.View>
        ))}
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  lessonNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.slate[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.slate[900],
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 13,
    color: colors.slate[600],
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.slate[600],
  },
});

export default ModuleDetailScreen;
