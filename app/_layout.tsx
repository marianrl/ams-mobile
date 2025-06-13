import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useState } from 'react';
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

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [selectedInput, setSelectedInput] = useState<Input | null>(null);

  if (!loaded) {
    return null;
  }

  const modalContext = {
    showModal: (input: Input) => setSelectedInput(input),
    hideModal: () => setSelectedInput(null),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ModalContext.Provider value={modalContext}>
          <Stack initialRouteName="login">
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
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
