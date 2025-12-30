import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Text, ProgressBar, Surface, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getTotalXP } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    loadXP();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadXP();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadXP = async () => {
    const xp = await getTotalXP();
    setTotalXP(xp);
    const calculatedLevel = Math.floor(xp / 100) + 1;
    setLevel(calculatedLevel);
  };

  const progressPercent = ((totalXP % 100) / 100);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            📖 Olá, Estudante!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Continue sua jornada de aprendizado
          </Text>
        </View>

        {/* Card de XP e Nível */}
        <Card style={styles.xpCard} mode="elevated">
          <Card.Content>
            <View style={styles.levelContainer}>
              <View>
                <Text variant="labelSmall" style={styles.label}>Nível</Text>
                <Text variant="displaySmall" style={styles.levelValue}>{level}</Text>
              </View>
              <View style={styles.xpContainer}>
                <Text variant="labelSmall" style={styles.label}>XP Total</Text>
                <Text variant="headlineMedium" style={styles.xpValue}>
                  {totalXP} ⭐
                </Text>
              </View>
            </View>

            {/* Barra de Progresso */}
            <View style={styles.progressContainer}>
              <ProgressBar 
                progress={progressPercent} 
                color="#4ecca3"
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.progressText}>
                {totalXP % 100}/100 XP para próximo nível
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon={() => <Icon name="book-open-variant" size={20} color="#fff" />}
            onPress={() => navigation.navigate('Verse')}
            style={styles.button}
            buttonColor="#e94560"
          >
            Versículo do Dia
          </Button>

          <Button
            mode="contained"
            icon={() => <Icon name="format-list-bulleted" size={20} color="#fff" />}
            onPress={() => navigation.navigate('VerseList')}
            style={styles.button}
            buttonColor="#0f3460"
          >
            Lista de Versículos
          </Button>

          <Button
            mode="contained"
            icon={() => <Icon name="robot" size={20} color="#fff" />}
            onPress={() => navigation.navigate('AIChat')}
            style={styles.button}
            buttonColor="#4ecca3"
          >
            Chat com IA
          </Button>

          <Button
            mode="outlined"
            icon={() => <Icon name="bell-outline" size={20} color="#4ecca3" />}
            onPress={() => navigation.navigate('Reminders')}
            style={styles.button}
            textColor="#4ecca3"
          >
            Configurar Lembretes
          </Button>
        </View>

        {/* Card de Motivação */}
        <Surface style={styles.motivationCard} elevation={2}>
          <Text variant="displaySmall">💪</Text>
          <Text variant="bodyMedium" style={styles.motivationText}>
            Continue estudando! Cada versículo te aproxima mais do conhecimento.
          </Text>
        </Surface>
      </ScrollView>

      {/* FAB flutuante */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('VerseList')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  greeting: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#aaa',
  },
  xpCard: {
    backgroundColor: '#0f3460',
    marginBottom: 20,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    color: '#aaa',
    marginBottom: 4,
  },
  levelValue: {
    color: '#e94560',
    fontWeight: 'bold',
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16213e',
  },
  progressText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
  },
  motivationCard: {
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ecca3',
  },
  motivationText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4ecca3',
  },
});

export default HomeScreen;