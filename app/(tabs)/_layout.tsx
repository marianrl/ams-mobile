import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#00004b" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#9E9E9E',
          headerShown: true,
          headerStyle: {
            paddingTop: StatusBar.currentHeight,
            backgroundColor: '#00004b',
          },
          headerTintColor: '#FFFFFF',
          tabBarButton: HapticTab,
          tabBarBackground: () => null,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: '#00004b',
            },
            default: {
              height: 80,
              paddingBottom: 8,
              backgroundColor: '#00004b',
            },
          }),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? 'dashboard' : 'space-dashboard'}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="auditorias"
          options={{
            title: 'Auditorías',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? 'check-box' : 'check-box-outline-blank'}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reportes"
          options={{
            title: 'Reportes',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? 'bar-chart' : 'insert-chart-outlined'}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="usuario"
          options={{
            title: 'Usuario',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? 'person' : 'person-outline'}
                size={28}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
