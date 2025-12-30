import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import VerseScreen from './src/screens/VerseScreen';
import VerseListScreen from './src/screens/VerseListScreen';
import VerseDetailScreen from './src/screens/VerseDetailScreen';
import AIScreen from './src/screens/AIScreen';
import RemindersScreen from './src/screens/RemindersScreen';

const Stack = createNativeStackNavigator();

// Tema customizado
const theme = {
  colors: {
    primary: '#4ecca3',
    accent: '#e94560',
    background: '#1a1a2e',
    surface: '#0f3460',
    text: '#ffffff',
    disabled: '#aaa',
    placeholder: '#aaa',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  dark: true,
};

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#0f3460' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Hello Bible' }}
            />
            <Stack.Screen 
              name="Verse" 
              component={VerseScreen}
              options={{ title: 'Versículo do Dia' }}
            />
            <Stack.Screen 
              name="VerseList" 
              component={VerseListScreen}
              options={{ title: 'Lista de Versículos' }}
            />
            <Stack.Screen 
              name="VerseDetail" 
              component={VerseDetailScreen}
              options={{ title: 'Detalhes' }}
            />
            <Stack.Screen 
              name="AIChat" 
              component={AIScreen}
              options={{ title: 'Chat com IA' }}
            />
            <Stack.Screen 
              name="Reminders" 
              component={RemindersScreen}
              options={{ title: 'Lembretes' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;