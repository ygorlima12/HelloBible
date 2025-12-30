import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import OpenAIService from '../services/OpenAIService';

const ApiKeyConfig = ({ visible, onClose, onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (visible) {
      loadExistingKey();
    }
  }, [visible]);

  const loadExistingKey = async () => {
    const existingKey = await OpenAIService.getApiKey();
    if (existingKey) {
      setHasExistingKey(true);
      setApiKey(existingKey);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma chave de API válida.');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      Alert.alert(
        'Atenção',
        'A chave da API deve começar com "sk-". Tem certeza que está correta?'
      );
    }

    setLoading(true);

    try {
      // Testar a chave antes de salvar
      const testResult = await OpenAIService.testApiKey(apiKey);

      if (testResult.success) {
        // Salvar a chave
        await OpenAIService.saveApiKey(apiKey);

        Alert.alert(
          'Sucesso!',
          'Chave de API configurada com sucesso. Você já pode usar o chat com IA!',
          [
            {
              text: 'OK',
              onPress: () => {
                onConfigured?.();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Erro', testResult.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a chave de API.');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma chave de API.');
      return;
    }

    setTesting(true);

    try {
      const result = await OpenAIService.testApiKey(apiKey);

      if (result.success) {
        Alert.alert('✅ Sucesso', result.message);
      } else {
        Alert.alert('❌ Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível testar a chave.');
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remover Chave',
      'Tem certeza que deseja remover a chave de API? Você precisará configurar novamente para usar o chat.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await OpenAIService.removeApiKey();
            setApiKey('');
            setHasExistingKey(false);
            Alert.alert('Removido', 'Chave de API removida com sucesso.');
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Icon name="key" size={28} color={colors.white} />
              <Text style={styles.headerTitle}>Configurar OpenAI</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.infoCard}>
              <Icon name="information" size={24} color={colors.primary[600]} />
              <Text style={styles.infoText}>
                Para usar o chat com IA, você precisa de uma chave de API da OpenAI.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Como obter sua chave:</Text>
              <View style={styles.stepsList}>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Acesse: platform.openai.com/api-keys
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Faça login ou crie uma conta
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Clique em "Create new secret key"
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Copie a chave e cole abaixo
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Chave da API (API Key)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="sk-..."
                  placeholderTextColor={colors.slate[400]}
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry={!showKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowKey(!showKey)}
                  style={styles.eyeButton}
                >
                  <Icon
                    name={showKey ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.slate[600]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={handleTest}
                disabled={testing || loading || !apiKey.trim()}
                style={[
                  styles.testButton,
                  (!apiKey.trim() || testing || loading) && styles.buttonDisabled,
                ]}
              >
                {testing ? (
                  <ActivityIndicator size="small" color={colors.primary[600]} />
                ) : (
                  <>
                    <Icon name="check-circle" size={20} color={colors.primary[600]} />
                    <Text style={styles.testButtonText}>Testar Chave</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={loading || testing || !apiKey.trim()}
                style={styles.saveButtonWrapper}
              >
                <LinearGradient
                  colors={
                    loading || testing || !apiKey.trim()
                      ? [colors.slate[300], colors.slate[400]]
                      : colors.gradients.primary
                  }
                  style={styles.saveButton}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Icon name="content-save" size={20} color={colors.white} />
                      <Text style={styles.saveButtonText}>
                        {hasExistingKey ? 'Atualizar' : 'Salvar'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {hasExistingKey && (
              <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                <Icon name="delete" size={18} color={colors.error} />
                <Text style={styles.removeButtonText}>Remover Chave</Text>
              </TouchableOpacity>
            )}

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Icon name="shield-check" size={16} color={colors.success} />
              <Text style={styles.securityText}>
                Sua chave é armazenada localmente no dispositivo de forma segura.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary[50],
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.slate[700],
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 12,
  },
  stepsList: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.slate[700],
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[900],
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.slate[300],
    borderRadius: 12,
    backgroundColor: colors.slate[50],
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.slate[900],
  },
  eyeButton: {
    padding: 12,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[600],
    backgroundColor: colors.white,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary[600],
  },
  saveButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.success + '10',
    borderRadius: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: colors.slate[600],
  },
});

export default ApiKeyConfig;
