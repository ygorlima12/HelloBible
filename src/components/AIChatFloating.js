import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Text, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { height } = Dimensions.get('window');

const AIChatFloating = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou seu assistente teológico com IA. Como posso ajudá-lo hoje?',
      isAI: true,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickSuggestions = [
    'Explique Hebreus 11:1',
    'Contexto histórico de João',
    'Versículos sobre fé',
    'Significado de salvação',
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      // Adicionar mensagem do usuário
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        isAI: false,
      };
      setMessages([...messages, newMessage]);

      // Simular resposta da IA
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: 'Entendo sua pergunta. Deixe-me ajudá-lo com isso...',
          isAI: true,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);

      setInputText('');
    }
  };

  const handleSuggestion = (suggestion) => {
    setInputText(suggestion);
  };

  return (
    <>
      {/* FAB Button */}
      <FAB
        icon={() => <Icon name="robot" size={24} color={colors.white} />}
        style={styles.fab}
        onPress={() => setVisible(true)}
        customSize={56}
      />

      {/* Chat Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={SlideInDown.duration(300)}
            style={styles.chatContainer}
          >
            {/* Header */}
            <LinearGradient
              colors={[...colors.gradients.primary, colors.primary[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chatHeader}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                  <Icon name="brain" size={28} color={colors.white} />
                  <View>
                    <Text style={styles.headerTitle}>Assistente Teológico IA</Text>
                    <View style={styles.onlineIndicator}>
                      <View style={styles.onlineDot} />
                      <Text style={styles.onlineText}>Online</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color={colors.white} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Messages Area */}
            <ScrollView
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((message, index) => (
                <Animated.View
                  key={message.id}
                  entering={FadeIn.delay(index * 100)}
                  style={[
                    styles.messageWrapper,
                    message.isAI ? styles.messageWrapperAI : styles.messageWrapperUser
                  ]}
                >
                  {message.isAI ? (
                    <View style={styles.messageAI}>
                      <Text style={styles.messageTextAI}>{message.text}</Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={colors.gradients.primary}
                      style={styles.messageUser}
                    >
                      <Text style={styles.messageTextUser}>{message.text}</Text>
                    </LinearGradient>
                  )}
                </Animated.View>
              ))}
            </ScrollView>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <View style={styles.suggestionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsContent}
                >
                  {quickSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionTag}
                      onPress={() => handleSuggestion(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua pergunta..."
                  placeholderTextColor={colors.slate[400]}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                />

                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                >
                  <LinearGradient
                    colors={inputText.trim() ? colors.gradients.primary : [colors.slate[300], colors.slate[400]]}
                    style={styles.sendButton}
                  >
                    <Icon
                      name="send"
                      size={20}
                      color={colors.white}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    backgroundColor: colors.primary[600],
    borderRadius: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: height * 0.85,
    overflow: 'hidden',
  },
  chatHeader: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  messageWrapperAI: {
    alignItems: 'flex-start',
  },
  messageWrapperUser: {
    alignItems: 'flex-end',
  },
  messageAI: {
    backgroundColor: colors.slate[100],
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    maxWidth: '80%',
  },
  messageTextAI: {
    fontSize: 14,
    color: colors.slate[900],
    lineHeight: 20,
  },
  messageUser: {
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
    maxWidth: '80%',
  },
  messageTextUser: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionTag: {
    backgroundColor: colors.slate[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.slate[700],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
  },
  input: {
    flex: 1,
    backgroundColor: colors.slate[100],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.slate[200],
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.slate[900],
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIChatFloating;
