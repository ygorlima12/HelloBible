import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Text, Surface, Avatar, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import AuthService from '../services/AuthService';
import GamificationService from '../services/GamificationService';
import OpenAIService from '../services/OpenAIService';

const ProfileScreen = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
    setEditName(currentUser?.name || '');

    const userStats = await GamificationService.getStats();
    const achievements = await GamificationService.getAllAchievements();
    setStats({ ...userStats, achievements });

    const hasKey = await OpenAIService.hasApiKey();
    setHasApiKey(hasKey);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma chave válida');
      return;
    }

    const result = await OpenAIService.testApiKey(apiKey);
    if (result.success) {
      await OpenAIService.saveApiKey(apiKey);
      setHasApiKey(true);
      setShowApiKeyModal(false);
      setApiKey('');
      Alert.alert('Sucesso', 'Chave da API configurada com sucesso!');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Erro', 'Nome não pode estar vazio');
      return;
    }

    const result = await AuthService.updateUser({ name: editName });
    if (result.success) {
      setUser(result.user);
      setShowEditModal(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            if (onLogout) onLogout();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza? Todos os seus dados serão perdidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await AuthService.deleteAccount();
            if (onLogout) onLogout();
          },
        },
      ]
    );
  };

  if (!user || !stats) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const getInitials = () => {
    return user.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Icon name="pencil" size={16} color={colors.primary[600]} />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            style={styles.statCard}
          >
            <Surface style={styles.statSurface} elevation={1}>
              <Icon name="fire" size={32} color="#f97316" />
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Dias de Sequência</Text>
            </Surface>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(600)}
            style={styles.statCard}
          >
            <Surface style={styles.statSurface} elevation={1}>
              <Icon name="trophy" size={32} color={colors.primary[600]} />
              <Text style={styles.statValue}>{stats.level}</Text>
              <Text style={styles.statLabel}>Nível</Text>
            </Surface>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.statCard}
          >
            <Surface style={styles.statSurface} elevation={1}>
              <Icon name="star" size={32} color="#eab308" />
              <Text style={styles.statValue}>{stats.totalXP}</Text>
              <Text style={styles.statLabel}>XP Total</Text>
            </Surface>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(250).duration(600)}
            style={styles.statCard}
          >
            <Surface style={styles.statSurface} elevation={1}>
              <Icon name="book-check" size={32} color={colors.success} />
              <Text style={styles.statValue}>{stats.lessonsCompleted}</Text>
              <Text style={styles.statLabel}>Lições</Text>
            </Surface>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={styles.sectionTitle}>Conquistas Desbloqueadas</Text>
          <Surface style={styles.achievementsCard} elevation={1}>
            {stats.achievements.filter(a => a.unlocked).length === 0 ? (
              <Text style={styles.emptyText}>
                Complete lições para desbloquear conquistas!
              </Text>
            ) : (
              stats.achievements
                .filter(a => a.unlocked)
                .map((achievement, index) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <LinearGradient
                      colors={achievement.color}
                      style={styles.achievementIcon}
                    >
                      <Icon name={achievement.icon} size={20} color={colors.white} />
                    </LinearGradient>
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementDesc}>{achievement.description}</Text>
                    </View>
                    <Text style={styles.achievementXP}>+{achievement.xp} XP</Text>
                  </View>
                ))
            )}
          </Surface>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(600)}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <Surface style={styles.settingsCard} elevation={1}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowApiKeyModal(true)}
            >
              <View style={styles.settingLeft}>
                <Icon name="key" size={24} color={colors.primary[600]} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Chave OpenAI</Text>
                  <Text style={styles.settingDesc}>
                    {hasApiKey ? 'Configurada' : 'Não configurada'}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={colors.slate[400]} />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="bell" size={24} color={colors.primary[600]} />
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Notificações</Text>
                  <Text style={styles.settingDesc}>Lembretes diários</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color={colors.primary[600]}
              />
            </View>
          </Surface>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <Modal
        visible={showApiKeyModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowApiKeyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chave da API OpenAI</Text>
              <TouchableOpacity onPress={() => setShowApiKeyModal(false)}>
                <Icon name="close" size={24} color={colors.slate[600]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Insira sua chave da API da OpenAI para usar as ferramentas de IA
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="sk-..."
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              placeholderTextColor={colors.slate[400]}
            />

            <TouchableOpacity
              style={styles.modalButtonWrapper}
              onPress={handleSaveApiKey}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Icon name="close" size={24} color={colors.slate[600]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Seu nome"
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor={colors.slate[400]}
            />

            <TouchableOpacity
              style={styles.modalButtonWrapper}
              onPress={handleUpdateProfile}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.white,
  },
  avatarLabel: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary[600],
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
  },
  statSurface: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.slate[900],
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.slate[600],
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 12,
  },
  achievementsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: colors.slate[500],
    textAlign: 'center',
    paddingVertical: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate[900],
  },
  achievementDesc: {
    fontSize: 12,
    color: colors.slate[600],
    marginTop: 2,
  },
  achievementXP: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[600],
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.slate[900],
  },
  settingDesc: {
    fontSize: 13,
    color: colors.slate[600],
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    color: colors.slate[500],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.slate[900],
  },
  modalDesc: {
    fontSize: 14,
    color: colors.slate[600],
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate[900],
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: colors.slate[50],
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.slate[900],
    borderWidth: 1,
    borderColor: colors.slate[200],
    marginBottom: 16,
  },
  modalButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});

export default ProfileScreen;
