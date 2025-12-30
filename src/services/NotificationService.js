import notifee, { TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = async () => {
    // Criar canal de notificação (Android)
    await notifee.createChannel({
      id: 'hello-bible-reminder',
      name: 'Lembretes de Estudo',
      description: 'Lembretes diários para estudar a Bíblia',
      importance: 4,
      sound: 'default',
      vibration: true,
    });

    // Solicitar permissão (iOS)
    if (Platform.OS === 'ios') {
      await notifee.requestPermission();
    }
  };

  // Notificação imediata
  showNotification = async (title, message) => {
    await notifee.displayNotification({
      title: title,
      body: message,
      android: {
        channelId: 'hello-bible-reminder',
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  // Agendar notificação diária
  scheduleDailyReminder = async (hour, minute, title, message) => {
    // Cancelar notificações antigas primeiro
    await notifee.cancelAllNotifications();

    const now = new Date();
    const scheduledDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0
    );

    // Se o horário já passou hoje, agenda para amanhã
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: scheduledDate.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        title: title,
        body: message,
        android: {
          channelId: 'hello-bible-reminder',
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger
    );

    return scheduledDate;
  };

  // Cancelar todas as notificações
  cancelAllNotifications = async () => {
    await notifee.cancelAllNotifications();
  };

  // Listar notificações agendadas
  getScheduledNotifications = async () => {
    const triggers = await notifee.getTriggerNotifications();
    return triggers;
  };
}

export default new NotificationService();