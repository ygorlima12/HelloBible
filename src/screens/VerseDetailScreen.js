import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { toggleFavorite, isFavorite, isCompleted, markAsCompleted, addXP } from '../utils/storage';

const VerseDetailScreen = ({ route, navigation }) => {
  const { verse } = route.params;
  const [favorite, setFavorite] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const favStatus = await isFavorite(verse.id);
    const compStatus = await isCompleted(verse.id);
    setFavorite(favStatus);
    setCompleted(compStatus);
  };

  const handleFavorite = async () => {
    const newStatus = await toggleFavorite(verse.id);
    setFavorite(newStatus);
    Alert.alert(
      newStatus ? 'Adicionado aos favoritos!' : 'Removido dos favoritos',
      newStatus ? '⭐ Você pode revisar depois!' : ''
    );
  };

  const handleComplete = async () => {
    if (!completed) {
      const wasMarked = await markAsCompleted(verse.id);
      if (wasMarked) {
        const newXP = await addXP(verse.points);
        setCompleted(true);
        Alert.alert(
          '🎉 Parabéns!',
          `Você ganhou +${verse.points} XP!\n\nXP Total: ${newXP} ⭐`,
          [{ text: 'Continuar', onPress: () => navigation.goBack() }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.reference}>{verse.reference}</Text>
        <Text style={styles.verseText}>{verse.text}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.favoriteButton, favorite && styles.favoriteActive]}
          onPress={handleFavorite}
        >
          <Text style={styles.buttonText}>
            {favorite ? '⭐ Favoritado' : '☆ Favoritar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.completeButton,
            completed && styles.completedButton,
          ]}
          onPress={handleComplete}
          disabled={completed}
        >
          <Text style={styles.buttonText}>
            {completed ? `✓ +${verse.points} XP Ganho` : `Completar (+${verse.points} XP)`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar para lista</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#0f3460',
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 5,
  },
  reference: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 20,
    textAlign: 'center',
  },
  verseText: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 28,
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3,
  },
  favoriteButton: {
    backgroundColor: '#16213e',
  },
  favoriteActive: {
    backgroundColor: '#2d3a5e',
  },
  completeButton: {
    backgroundColor: '#4ecca3',
  },
  completedButton: {
    backgroundColor: '#2d4a3e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default VerseDetailScreen;