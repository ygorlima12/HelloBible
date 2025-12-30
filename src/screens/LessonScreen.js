import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import ModulesService from '../services/ModulesService';
import GamificationService from '../services/GamificationService';

const { width, height } = Dimensions.get('window');

const LessonScreen = ({ route, navigation }) => {
  const { moduleId, lessonId, moduleColor } = route.params;
  const [lesson, setLesson] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    loadLesson();
    GamificationService.initialize();
  }, []);

  const loadLesson = async () => {
    const module = await ModulesService.getModuleById(moduleId);
    const lessonData = module.lessons.find(l => l.id === lessonId);
    setLesson(lessonData);
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const currentCard = lesson.cards[currentCardIndex];
  const isLastCard = currentCardIndex === lesson.cards.length - 1;
  const isQuizCard = currentCard.type === 'quiz';

  const handleNext = () => {
    if (isLastCard) {
      if (isQuizCard && !showResults) {
        calculateQuizScore();
      } else {
        completeLesson();
      }
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const calculateQuizScore = () => {
    const questions = currentCard.questions;
    let correct = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    setQuizScore(score);
    setShowResults(true);
  };

  const completeLesson = async () => {
    // Marcar lição como completa
    await ModulesService.completeLesson(moduleId, lessonId);

    // Ganhar XP
    const result = await GamificationService.completeLesson(quizScore);

    setReward(result);
    setRewardModalVisible(true);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderContentCard = (card) => (
    <Animated.View
      key={currentCardIndex}
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.card}
    >
      <ScrollView
        style={styles.cardScrollView}
        contentContainerStyle={styles.cardScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {card.icon && (
          <View style={styles.cardIconContainer}>
            <Icon name={card.icon} size={48} color={moduleColor.from} />
          </View>
        )}

        <Text style={styles.cardTitle}>{card.title}</Text>

        <Text style={styles.cardContent}>{card.content}</Text>

        {card.verse && (
          <View style={styles.verseContainer}>
            <Icon name="format-quote-close" size={24} color={moduleColor.from} />
            <Text style={styles.verseText}>{card.verse}</Text>
            <Text style={styles.verseReference}>{card.verseReference}</Text>
          </View>
        )}

        {card.keyPoints && (
          <View style={styles.keyPointsContainer}>
            {card.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPoint}>
                <View style={[styles.bullet, { backgroundColor: moduleColor.from }]} />
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderQuizCard = (card) => (
    <Animated.View
      key={currentCardIndex}
      entering={SlideInRight.duration(300)}
      style={styles.card}
    >
      <ScrollView
        style={styles.cardScrollView}
        contentContainerStyle={styles.cardScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.quizHeader}>
          <Icon name="help-circle" size={40} color={moduleColor.from} />
          <Text style={styles.quizTitle}>Quiz de Verificação</Text>
          <Text style={styles.quizSubtitle}>Teste seu conhecimento!</Text>
        </View>

        {card.questions.map((question, qIndex) => (
          <View key={qIndex} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {qIndex + 1}. {question.question}
            </Text>

            {question.options.map((option, oIndex) => {
              const isSelected = selectedAnswers[qIndex] === oIndex;
              const isCorrect = oIndex === question.correctAnswer;
              const showCorrect = showResults && isCorrect;
              const showWrong = showResults && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={oIndex}
                  style={[
                    styles.optionButton,
                    isSelected && !showResults && styles.optionSelected,
                    showCorrect && styles.optionCorrect,
                    showWrong && styles.optionWrong,
                  ]}
                  onPress={() => !showResults && handleAnswer(qIndex, oIndex)}
                  disabled={showResults}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionRadio,
                      isSelected && !showResults && styles.optionRadioSelected,
                      showCorrect && styles.optionRadioCorrect,
                      showWrong && styles.optionRadioWrong,
                    ]}>
                      {showCorrect && <Icon name="check" size={16} color={colors.white} />}
                      {showWrong && <Icon name="close" size={16} color={colors.white} />}
                    </View>
                    <Text style={[
                      styles.optionText,
                      showCorrect && styles.optionTextCorrect,
                      showWrong && styles.optionTextWrong,
                    ]}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {showResults && (
          <Animated.View entering={ZoomIn.duration(500)} style={styles.scoreContainer}>
            <LinearGradient
              colors={quizScore >= 70 ? colors.gradients.success : colors.gradients.warning}
              style={styles.scoreCard}
            >
              <Text style={styles.scoreTitle}>Sua Pontuação</Text>
              <Text style={styles.scoreValue}>{quizScore}%</Text>
              <Text style={styles.scoreMessage}>
                {quizScore === 100 ? '🎉 Perfeito!' : quizScore >= 70 ? '👏 Muito bem!' : '💪 Continue praticando!'}
              </Text>
            </LinearGradient>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[moduleColor.from, moduleColor.to]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentCardIndex + 1} / {lesson.cards.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentCardIndex + 1) / lesson.cards.length) * 100}%` }
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Card Content */}
      <View style={styles.content}>
        {currentCard.type === 'content' && renderContentCard(currentCard)}
        {currentCard.type === 'quiz' && renderQuizCard(currentCard)}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentCardIndex > 0 && (
          <TouchableOpacity
            onPress={handlePrevious}
            style={styles.navButton}
          >
            <Icon name="chevron-left" size={24} color={moduleColor.from} />
            <Text style={[styles.navButtonText, { color: moduleColor.from }]}>
              Anterior
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={handleNext}
          disabled={isQuizCard && Object.keys(selectedAnswers).length < currentCard.questions?.length && !showResults}
          style={styles.navButtonWrapper}
        >
          <LinearGradient
            colors={[moduleColor.from, moduleColor.to]}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {isLastCard ? (showResults ? 'Concluir' : 'Ver Resultado') : 'Próximo'}
            </Text>
            <Icon name="chevron-right" size={20} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Reward Modal */}
      <Modal
        visible={rewardModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setRewardModalVisible(false);
          handleClose();
        }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(500)} style={styles.rewardModal}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.rewardContent}
            >
              <Icon name="trophy-variant" size={64} color={colors.white} />

              <Text style={styles.rewardTitle}>Lição Completa!</Text>

              <View style={styles.rewardStats}>
                <View style={styles.rewardStat}>
                  <Text style={styles.rewardStatValue}>+{reward?.xpGained}</Text>
                  <Text style={styles.rewardStatLabel}>XP</Text>
                </View>

                {reward?.leveledUp && (
                  <View style={styles.rewardStat}>
                    <Text style={styles.rewardStatValue}>↑ Nível {reward.newLevel}</Text>
                    <Text style={styles.rewardStatLabel}>Level Up!</Text>
                  </View>
                )}

                {reward?.streak > 0 && (
                  <View style={styles.rewardStat}>
                    <Icon name="fire" size={24} color={colors.white} />
                    <Text style={styles.rewardStatValue}>{reward.streak}</Text>
                    <Text style={styles.rewardStatLabel}>Dias</Text>
                  </View>
                )}
              </View>

              {reward?.newAchievements?.length > 0 && (
                <View style={styles.achievementsContainer}>
                  <Text style={styles.achievementsTitle}>Novas Conquistas!</Text>
                  {reward.newAchievements.map((ach, index) => (
                    <View key={index} style={styles.achievementItem}>
                      <Icon name={ach.icon} size={20} color={colors.white} />
                      <Text style={styles.achievementText}>{ach.title}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  setRewardModalVisible(false);
                  handleClose();
                }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    flex: 1,
  },
  cardScrollView: {
    flex: 1,
  },
  cardScrollContent: {
    flexGrow: 1,
  },
  cardIconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.slate[900],
    marginBottom: 16,
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.slate[700],
    marginBottom: 20,
  },
  verseContainer: {
    backgroundColor: colors.primary[50],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[600],
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  verseText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.slate[900],
    marginVertical: 8,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[600],
  },
  keyPointsContainer: {
    gap: 12,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.slate[800],
  },
  quizHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.slate[900],
    marginTop: 12,
  },
  quizSubtitle: {
    fontSize: 14,
    color: colors.slate[600],
    marginTop: 4,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: colors.slate[200],
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  optionSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
  },
  optionWrong: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.slate[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600],
  },
  optionRadioCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  optionRadioWrong: {
    borderColor: colors.error,
    backgroundColor: colors.error,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.slate[800],
  },
  optionTextCorrect: {
    color: colors.success,
    fontWeight: '600',
  },
  optionTextWrong: {
    color: colors.error,
  },
  scoreContainer: {
    marginTop: 20,
  },
  scoreCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.white,
  },
  scoreMessage: {
    fontSize: 18,
    color: colors.white,
    marginTop: 8,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
    backgroundColor: colors.white,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 12,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  navButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardModal: {
    width: width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
  },
  rewardContent: {
    padding: 32,
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    marginTop: 16,
    marginBottom: 24,
  },
  rewardStats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  rewardStat: {
    alignItems: 'center',
  },
  rewardStatValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
  },
  rewardStatLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  achievementsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  continueButton: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[600],
  },
});

export default LessonScreen;
