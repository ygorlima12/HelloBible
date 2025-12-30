import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const VerseScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.verse}>
          "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito"
        </Text>
        <Text style={styles.reference}>João 3:16</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#0f3460',
    padding: 30,
    borderRadius: 15,
    marginBottom: 40,
    elevation: 5,
  },
  verse: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 28,
  },
  reference: {
    fontSize: 16,
    color: '#e94560',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default VerseScreen;