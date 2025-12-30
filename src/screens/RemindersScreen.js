import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import NotificationService from '../services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RemindersScreen = () => {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);

  // ====== FUNÇÕES PRIMEIRO ======
  
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão de notificação concedida');
        return true;
      } else {
        console.log('Permissão de notificação negada');
        Alert.alert(
          'Permissão Necessária',
          'Por favor, habilite notificações nas configurações do app'
        );
        return false;
      }
    }
    return true;
  };

  const loadReminderSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('@HelloBible:reminderEnabled');
      const hour = await AsyncStorage.getItem('@HelloBible:reminderHour');
      
      if (enabled) setReminderEnabled(enabled === 'true');
      if (hour) setSelectedHour(parseInt(hour));
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const toggleReminder = async () => {
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      return;
    }

    if (!reminderEnabled) {
      try {
        const scheduledDate = await NotificationService.scheduleDailyReminder(
          selectedHour,
          0,
          '📖 Hora de estudar!',
          'Seu versículo diário te aguarda!'
        );
        
        setReminderEnabled(true);
        await AsyncStorage.setItem('@HelloBible:reminderEnabled', 'true');
        
        Alert.alert(
          'Lembrete Ativado! 🔔',
          `Você receberá notificações diárias às ${selectedHour}:00`
        );
      } catch (error) {
        console.error('Erro ao agendar:', error);
        Alert.alert('Erro', 'Não foi possível agendar o lembrete');
      }
    } else {
      await NotificationService.cancelAllNotifications();
      setReminderEnabled(false);
      await AsyncStorage.setItem('@HelloBible:reminderEnabled', 'false');
      
      Alert.alert('Lembrete Desativado', 'Você não receberá mais notificações');
    }
  };

  const changeHour = async (hour) => {
    setSelectedHour(hour);
    await AsyncStorage.setItem('@HelloBible:reminderHour', hour.toString());
    
    if (reminderEnabled) {
      await NotificationService.cancelAllNotifications();
      await NotificationService.scheduleDailyReminder(
        hour,
        0,
        '📖 Hora de estudar!',
        'Seu versículo diário te aguarda!'
      );
      
      Alert.alert('Horário Atualizado!', `Novo horário: ${hour}:00`);
    }
  };

  const testNotification = async () => {
    Alert.alert('Debug', 'Botão clicado! Vamos testar...');
    
    const hasPermission = await requestNotificationPermission();
    
    Alert.alert('Debug', `Permissão: ${hasPermission ? 'OK' : 'Negada'}`);
    
    if (hasPermission) {
      try {
        console.log('=== ENVIANDO NOTIFICAÇÃO ===');
        
        await NotificationService.showNotification(
          '📖 Teste de Notificação',
          'Se você viu isso, está funcionando! 🎉'
        );
        
        console.log('=== NOTIFICAÇÃO ENVIADA ===');
        Alert.alert('Sucesso', 'Notificação enviada! Verifique a barra de notificações');
      } catch (error) {
        console.error('=== ERRO ===', error);
        Alert.alert('Erro', `Erro: ${error.message}`);
      }
    }
  };

  // ====== useEffect DEPOIS ======
  
  useEffect(() => {
    loadReminderSettings();
  }, []);

  // ====== RENDER ======
  
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Lembretes Diários</Text>
        <Text style={styles.subtitle}>
          Configure notificações para não esquecer de estudar!
        </Text>
      </View>

      {/* Toggle Lembrete */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Lembrete Diário</Text>
            <Text style={styles.cardSubtitle}>
              {reminderEnabled ? 'Ativado' : 'Desativado'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, reminderEnabled && styles.toggleActive]}
            onPress={toggleReminder}
          >
            <Text style={styles.toggleText}>
              {reminderEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seletor de Horário */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Escolha o Horário</Text>
        <Text style={styles.cardSubtitle}>
          Quando você quer ser lembrado?
        </Text>
        
        <View style={styles.hoursContainer}>
          {hours.map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.hourButton,
                selectedHour === hour && styles.hourButtonActive,
              ]}
              onPress={() => changeHour(hour)}
            >
              <Text
                style={[
                  styles.hourText,
                  selectedHour === hour && styles.hourTextActive,
                ]}
              >
                {hour}:00
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão de Teste */}
      <TouchableOpacity style={styles.testButton} onPress={testNotification}>
        <Text style={styles.testButtonText}>🧪 Testar Notificação</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Dica: Mantenha as notificações ativadas para criar o hábito de
          estudar todos os dias!
        </Text>
      </View>
    </ScrollView>
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
    color: '#aaa',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#0f3460',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  toggle: {
    backgroundColor: '#16213e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  toggleActive: {
    backgroundColor: '#4ecca3',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 10,
  },
  hourButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 70,
  },
  hourButtonActive: {
    backgroundColor: '#e94560',
  },
  hourText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  hourTextActive: {
    color: '#fff',
  },
  testButton: {
    backgroundColor: '#16213e',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  testButtonText: {
    color: '#4ecca3',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#16213e',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecca3',
  },
  infoText: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 20,
  },
});

export default RemindersScreen;