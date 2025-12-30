import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import AuthService from '../services/AuthService';

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await AuthService.login(email, password);
      } else {
        result = await AuthService.register(name, email, password);
      }

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.gradient}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(800)}
          style={styles.header}
        >
          <Icon name="book-cross" size={64} color={colors.white} />
          <Text style={styles.title}>HelloBible</Text>
          <Text style={styles.subtitle}>
            Seu companheiro de estudos bíblicos
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.formCard}
        >
          <View style={styles.formHeader}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Icon name="account" size={20} color={colors.slate[400]} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.slate[400]}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color={colors.slate[400]} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.slate[400]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={colors.slate[400]} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.slate[400]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.slate[400]}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submitButtonWrapper}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(800)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos Termos de Uso e Política de
            Privacidade
          </Text>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.slate[100],
  },
  tabActive: {
    backgroundColor: colors.primary[600],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[600],
  },
  tabTextActive: {
    color: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.slate[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.slate[900],
    paddingVertical: 12,
  },
  submitButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
