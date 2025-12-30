import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getCompleted } from '../utils/storage';

const VerseListScreen = ({ navigation }) => {
  const [verses] = useState([
    { id: '1', text: 'Porque Deus amou o mundo de tal maneira...', reference: 'João 3:16', points: 10 },
    { id: '2', text: 'O Senhor é o meu pastor, nada me faltará', reference: 'Salmos 23:1', points: 15 },
    { id: '3', text: 'Tudo posso naquele que me fortalece', reference: 'Filipenses 4:13', points: 20 },
    { id: '4', text: 'Confie no Senhor de todo o seu coração', reference: 'Provérbios 3:5', points: 10 },
    { id: '5', text: 'Não temas, porque eu sou contigo', reference: 'Isaías 41:10', points: 25 },
  ]);

  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    loadCompleted();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadCompleted();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadCompleted = async () => {
    const completed = await getCompleted();
    setCompletedIds(completed);
  };

  const renderVerseCard = ({ item }) => {
    const isCompleted = completedIds.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.completedCard]}
        onPress={() => navigation.navigate('VerseDetail', { verse: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.reference}>{item.reference}</Text>
          {isCompleted ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completo</Text>
            </View>
          ) : (
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>+{item.points} XP</Text>
            </View>
          )}
        </View>
        <Text style={styles.verseText} numberOfLines={2}>
          {item.text}
        </Text>
        <Text style={styles.readMore}>
          {isCompleted ? 'Toque para reler →' : 'Toque para ler →'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Versículos para Estudar</Text>
        <Text style={styles.subtitle}>
          {completedIds.length}/{verses.length} completados
        </Text>
      </View>

      <FlatList
        data={verses}
        renderItem={renderVerseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#4ecca3',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reference: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e94560',
  },
  pointsBadge: {
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pointsText: {
    color: '#4ecca3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: '#2d4a3e',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  completedText: {
    color: '#4ecca3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verseText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 12,
    color: '#4ecca3',
    fontWeight: '600',
  },
});

export default VerseListScreen;