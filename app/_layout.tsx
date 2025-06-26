import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { InputDetailModal } from '../components/InputDetailModal';
import { AfipInput } from '../types/afipInput';
import { CommonInput } from '../types/commonInput';

import { useColorScheme } from '@/hooks/useColorScheme';

type Input = AfipInput | CommonInput;

interface ModalContextType {
  showModal: (input: Input) => void;
  hideModal: () => void;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  refreshAuthStatus: () => Promise<void>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [selectedInput, setSelectedInput] = useState<Input | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Clear any invalid data
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuthStatus = async () => {
    console.log('🔄 Refreshing authentication status...');
    await checkAuthStatus();
  };

  if (!loaded || isLoading) {
    return null;
  }

  const modalContext = {
    showModal: (input: Input) => setSelectedInput(input),
    hideModal: () => setSelectedInput(null),
  };

  const authContext = {
    isAuthenticated,
    isLoading,
    refreshAuthStatus: refreshAuthStatus,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthContext.Provider value={authContext}>
          <ModalContext.Provider value={modalContext}>
            <Stack initialRouteName={isAuthenticated ? '(tabs)' : 'login'}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="audit-details"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            {selectedInput && (
              <InputDetailModal
                input={selectedInput}
                onClose={() => setSelectedInput(null)}
              />
            )}
            <StatusBar style="light" backgroundColor="#00004b" />
          </ModalContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
