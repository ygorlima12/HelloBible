import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { paperTheme } from './src/theme/colors';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;