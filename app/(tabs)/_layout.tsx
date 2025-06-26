import { HapticTab } from '@/components/HapticTab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';

function AnimatedTabIcon({
  name,
  color,
  focused,
  label,
  unfocusedName,
}: {
  name: string;
  color: string;
  focused: boolean;
  label: string;
  unfocusedName?: string;
}) {
  const scale = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        transform: [{ scale }],
        minWidth: 70,
        marginTop: 8,
      }}
    >
      <MaterialIcons
        name={focused ? name : ((unfocusedName || name) as any)}
        size={28}
        color={color}
      />
      <Text
        style={{
          color,
          fontSize: 12,
          fontWeight: focused ? 'bold' : 'normal',
          marginTop: 2,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

function LogoRight() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
      <Image
        source={require('@/assets/images/Logo_izquierda.png')}
        style={{ width: 50, height: 50, marginRight: 16 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#00004b" />
      <Tabs
        initialRouteName="dashboard"
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
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                name="dashboard"
                unfocusedName="space-dashboard"
                color={color}
                focused={focused}
                label="Dashboard"
              />
            ),
            headerRight: LogoRight,
          }}
        />
        <Tabs.Screen
          name="auditorias"
          options={{
            title: 'Auditorías',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                name="check-box"
                unfocusedName="check-box-outline-blank"
                color={color}
                focused={focused}
                label="Auditorías"
              />
            ),
            headerRight: LogoRight,
          }}
        />
        <Tabs.Screen
          name="reportes"
          options={{
            title: 'Reportes',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                name="bar-chart"
                unfocusedName="insert-chart-outlined"
                color={color}
                focused={focused}
                label="Reportes"
              />
            ),
            headerRight: LogoRight,
          }}
        />
        <Tabs.Screen
          name="usuario"
          options={{
            title: 'Usuario',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                name="person"
                unfocusedName="person-outline"
                color={color}
                focused={focused}
                label="Usuario"
              />
            ),
            headerRight: LogoRight,
          }}
        />
      </Tabs>
    </>
  );
}
