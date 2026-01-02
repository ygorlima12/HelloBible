import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';

import NewHomeScreen from '../screens/NewHomeScreen';
import ModulesScreen from '../screens/ModulesScreen';
import BibleScreen from '../screens/BibleScreen';
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
            } else if (route.name === 'Bíblia') {
              // Botão central customizado - não renderiza ícone padrão
              return null;
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
          name="Bíblia"
          component={BibleScreen}
          options={{
            tabBarLabel: 'Bíblia',
            tabBarButton: (props) => (
              <View style={styles.centerButtonContainer}>
                <TouchableOpacity
                  {...props}
                  style={styles.centerButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={colors.gradients.primary}
                    style={styles.centerButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon name="book-open-page-variant" size={28} color={colors.white} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ),
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

const styles = StyleSheet.create({
  centerButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary[600],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default BottomTabNavigator;
