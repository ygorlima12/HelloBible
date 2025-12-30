import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, ActivityIndicator } from 'react-native';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ModuleDetailScreen from './src/screens/ModuleDetailScreen';
import LessonScreen from './src/screens/LessonScreen';
import StudyToolsScreen from './src/screens/StudyToolsScreen';
import SermonPreparationScreen from './src/screens/SermonPreparationScreen';
import LoginScreen from './src/screens/LoginScreen';
import AuthService from './src/services/AuthService';
import { paperTheme, colors } from './src/theme/colors';

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
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;