import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

import NewHomeScreen from '../screens/NewHomeScreen';
import ModulesScreen from '../screens/ModulesScreen';
import StudyToolsScreen from '../screens/StudyToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AIChatFloating from '../components/AIChatFloating';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ onLogout }) => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = 'book-open-variant';
            } else if (route.name === 'Módulos') {
              iconName = 'school';
            } else if (route.name === 'Ferramentas') {
              iconName = 'tools';
            } else if (route.name === 'Perfil') {
              iconName = 'account-circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary[600],
          tabBarInactiveTintColor: colors.slate[500],
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: colors.slate[200],
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Início"
          component={NewHomeScreen}
          options={{
            tabBarLabel: 'Início',
          }}
        />
        <Tab.Screen
          name="Módulos"
          component={ModulesScreen}
          options={{
            tabBarLabel: 'Módulos',
          }}
        />
        <Tab.Screen
          name="Ferramentas"
          component={StudyToolsScreen}
          options={{
            tabBarLabel: 'Ferramentas',
          }}
        />
        <Tab.Screen
          name="Perfil"
          options={{
            tabBarLabel: 'Perfil',
          }}
        >
          {props => <ProfileScreen {...props} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* Chat Flutuante */}
      <AIChatFloating />
    </>
  );
};

export default BottomTabNavigator;
