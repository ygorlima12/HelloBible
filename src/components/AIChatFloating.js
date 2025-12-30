import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import OpenAIService from '../services/OpenAIService';
import ApiKeyConfig from './ApiKeyConfig';

const { height } = Dimensions.get('window');

const AIChatFloating = () => {
  const [visible, setVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou seu assistente teológico com IA. Como posso ajudá-lo hoje?',
      isAI: true,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const scrollViewRef = useRef(null);

  const quickSuggestions = [
    'Explique Hebreus 11:1',
    'Contexto histórico de João',
    'Versículos sobre fé',
    'Significado de salvação',
  ];

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    if (visible) {
      checkApiKey();
    }
  }, [visible]);

  const checkApiKey = async () => {
    const keyExists = await OpenAIService.hasApiKey();
    setHasApiKey(keyExists);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (!hasApiKey) {
      Alert.alert(
        'Configuração Necessária',
        'Você precisa configurar sua chave da API OpenAI para usar o chat.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configurar', onPress: () => setConfigVisible(true) },
        ]
      );
      return;
    }

    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isAI: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // Scroll para o final
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Preparar histórico da conversa para a API
      const conversationHistory = messages
        .filter(msg => msg.id !== 1) // Remove mensagem inicial
        .map(msg => ({
          role: msg.isAI ? 'assistant' : 'user',
          content: msg.text,
        }));

      // Enviar para OpenAI
      const response = await OpenAIService.askBiblicalQuestion(
        inputText.trim(),
        conversationHistory
      );

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.message,
          isAI: true,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Mostrar erro
        Alert.alert('Erro', response.error);

        // Adicionar mensagem de erro
        const errorMessage = {
          id: Date.now() + 1,
          text: `Desculpe, ocorreu um erro: ${response.error}`,
          isAI: true,
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInputText(suggestion);
  };

  const handleOpenConfig = () => {
    setConfigVisible(true);
  };

  const handleConfigured = () => {
    checkApiKey();
  };

  const clearChat = () => {
    Alert.alert(
      'Limpar Conversa',
      'Deseja limpar todo o histórico de conversas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: 1,
                text: 'Olá! Sou seu assistente teológico com IA. Como posso ajudá-lo hoje?',
                isAI: true,
              },
            ]);
          },
        },
      ]
    );
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
                      <Text style={styles.onlineText}>
                        {hasApiKey ? 'Online' : 'Configuração necessária'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.headerActions}>
                  <TouchableOpacity
                    onPress={handleOpenConfig}
                    style={styles.configButton}
                  >
                    <Icon name="cog" size={20} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={clearChat}
                    style={styles.configButton}
                  >
                    <Icon name="broom" size={20} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={24} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            {/* Messages Area */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {!hasApiKey && (
                <View style={styles.warningCard}>
                  <Icon name="alert-circle" size={24} color={colors.warning} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningTitle}>Configure sua API Key</Text>
                    <Text style={styles.warningText}>
                      Para usar o chat com IA, configure sua chave da OpenAI.
                    </Text>
                    <TouchableOpacity
                      onPress={handleOpenConfig}
                      style={styles.configLinkButton}
                    >
                      <Text style={styles.configLinkText}>Configurar agora</Text>
                      <Icon name="arrow-right" size={16} color={colors.primary[600]} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

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
                    <View style={[
                      styles.messageAI,
                      message.isError && styles.messageError
                    ]}>
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

              {loading && (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingBubble}>
                    <ActivityIndicator size="small" color={colors.primary[600]} />
                    <Text style={styles.loadingText}>Pensando...</Text>
                  </View>
                </View>
              )}
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
                  editable={!loading}
                />

                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!inputText.trim() || loading}
                >
                  <LinearGradient
                    colors={inputText.trim() && !loading ? colors.gradients.primary : [colors.slate[300], colors.slate[400]]}
                    style={styles.sendButton}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Icon
                        name="send"
                        size={20}
                        color={colors.white}
                      />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>

      {/* API Key Configuration Modal */}
      <ApiKeyConfig
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        onConfigured={handleConfigured}
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  configButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning + '30',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: colors.slate[700],
    marginBottom: 8,
    lineHeight: 18,
  },
  configLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  configLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[600],
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
  messageError: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
    borderWidth: 1,
  },
  messageTextAI: {
    fontSize: 14,
    color: colors.slate[900],
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.slate[100],
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.slate[600],
    fontStyle: 'italic',
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
