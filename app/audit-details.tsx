import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { InputCard } from '../components/InputCard';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { ThemedText } from '../components/ThemedText';
import { afipInputService } from '../services/afip-input-service';
import { commonInputService } from '../services/common-input-service';
import { AfipInput } from '../types/afipInput';
import { CommonInput } from '../types/commonInput';
import { useModal } from './_layout';

export default function AuditDetailsScreen() {
  const { auditId, auditType } = useLocalSearchParams();
  const router = useRouter();
  const [inputs, setInputs] = useState<(AfipInput | CommonInput)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { showModal } = useModal();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response =
          auditType === 'AFIP'
            ? await afipInputService.fetchAfipInputsByAuditId(
                'afipInput',
                String(auditId)
              )
            : await commonInputService.fetchCommonInputsByAuditId(
                'commonInput',
                String(auditId)
              );
        if (response.status === 200) {
          setInputs(response.data);
        }
      } catch (error) {
        console.error('Error fetching inputs:', error);
        setErrorMessage('Error al procesar la solicitud');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [auditId, auditType]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 50);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#00004b" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Detalles de Auditoría</ThemedText>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.content}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00004b" />
          </View>
        ) : errorMessage ? (
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        ) : (
          inputs.map((input) => (
            <InputCard
              key={input.id}
              input={input}
              onPressDetail={() => showModal(input)}
            />
          ))
        )}
      </ScrollView>
      {showScrollTop && <ScrollToTopButton scrollViewRef={scrollRef} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 16 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00004b',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginTop: 20,
  },
});
