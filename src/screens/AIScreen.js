import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AIService from '../services/AIService';

const AIScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '0',
      text: 'Olá! 👋 Sou seu assistente de estudos bíblicos. Como posso te ajudar hoje?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');

    // Adicionar mensagem do usuário
    const newUserMessage = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Montar histórico de conversa para a API
    const conversationHistory = messages
      .filter((msg) => msg.id !== '0') // Remove mensagem inicial
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

    // Enviar para IA
    const response = await AIService.sendMessage(userMessage, conversationHistory);

    setIsLoading(false);

    // Adicionar resposta da IA
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: response.success
        ? response.message
        : 'Desculpe, ocorreu um erro. Tente novamente.',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  const renderSuggestions = () => {
    const suggestions = AIService.getSuggestions();

    if (messages.length > 1) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>💡 Perguntas sugeridas:</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => setInputText(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        ListHeaderComponent={renderSuggestions}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4ecca3" />
          <Text style={styles.loadingText}>Pensando...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua pergunta..."
          placeholderTextColor="#aaa"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 10,
  },
  suggestionsContainer: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  suggestionsTitle: {
    color: '#4ecca3',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestionButton: {
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 13,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#e94560',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#0f3460',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#aaa',
    marginHorizontal: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 20,
  },
  loadingText: {
    color: '#4ecca3',
    marginLeft: 10,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#0f3460',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4ecca3',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2d4a3e',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AIScreen;