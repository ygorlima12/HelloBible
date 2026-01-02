console.log('🟢 App.tsx: Starting imports...');

import React, { useState, useEffect } from 'react';
console.log('🟢 App.tsx: React imported');

import { NavigationContainer } from '@react-navigation/native';
console.log('🟢 App.tsx: NavigationContainer imported');

import { createNativeStackNavigator } from '@react-navigation/native-stack';
console.log('🟢 App.tsx: createNativeStackNavigator imported');

import { Provider as PaperProvider } from 'react-native-paper';
console.log('🟢 App.tsx: PaperProvider imported');

import { SafeAreaProvider } from 'react-native-safe-area-context';
console.log('🟢 App.tsx: SafeAreaProvider imported');

import { StatusBar, View, ActivityIndicator } from 'react-native';
console.log('🟢 App.tsx: React Native components imported');

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
console.log('🟢 App.tsx: BottomTabNavigator imported');

import ModuleDetailScreen from './src/screens/ModuleDetailScreen';
console.log('🟢 App.tsx: ModuleDetailScreen imported');

import LessonScreen from './src/screens/LessonScreen';
console.log('🟢 App.tsx: LessonScreen imported');

import StudyToolsScreen from './src/screens/StudyToolsScreen';
console.log('🟢 App.tsx: StudyToolsScreen imported');

import SermonPreparationScreen from './src/screens/SermonPreparationScreen';
console.log('🟢 App.tsx: SermonPreparationScreen imported');

import HistoricalContextScreen from './src/screens/HistoricalContextScreen';
console.log('🟢 App.tsx: HistoricalContextScreen imported');

import BiblicalDictionaryScreen from './src/screens/BiblicalDictionaryScreen';
console.log('🟢 App.tsx: BiblicalDictionaryScreen imported');

import LoginScreen from './src/screens/LoginScreen';
console.log('🟢 App.tsx: LoginScreen imported');

import AuthService from './src/services/AuthService';
console.log('🟢 App.tsx: AuthService imported');

import { paperTheme, colors } from './src/theme/colors';
console.log('🟢 App.tsx: paperTheme and colors imported');
console.log('✅ App.tsx: All imports completed successfully!');

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authed = await AuthService.isAuthenticated();
    setIsAuthenticated(authed);
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
            <ActivityIndicator size="large" color={colors.primary[600]} />
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <StatusBar barStyle="light-content" backgroundColor={colors.primary[600]} />
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {props => <BottomTabNavigator {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
            <Stack.Screen name="Lesson" component={LessonScreen} />
            <Stack.Screen name="StudyTools" component={StudyToolsScreen} />
            <Stack.Screen name="SermonPreparation" component={SermonPreparationScreen} />
            <Stack.Screen name="HistoricalContext" component={HistoricalContextScreen} />
            <Stack.Screen name="BiblicalDictionary" component={BiblicalDictionaryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;