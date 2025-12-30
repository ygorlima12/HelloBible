import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ModuleDetailScreen from './src/screens/ModuleDetailScreen';
import LessonScreen from './src/screens/LessonScreen';
import StudyToolsScreen from './src/screens/StudyToolsScreen';
import SermonPreparationScreen from './src/screens/SermonPreparationScreen';
import { paperTheme } from './src/theme/colors';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
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