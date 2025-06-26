import { useAuth } from '@/app/_layout';
import { AuditCard } from '@/components/AuditCard';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { ThemedText } from '@/components/ThemedText';
import { auditService } from '@/services/audit-service';
import { Audit } from '@/types/audit';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const ITEMS_PER_PAGE = 10;

function InternasScreen({
  scrollRef,
}: {
  scrollRef: React.RefObject<ScrollView>;
}) {
  const { isAuthenticated } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [internasAudits, setInternasAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setInternasAudits([]);
      setLoading(false);
    }
  }, [page, isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);

    setTimeout(() => {
      auditService
        .fetchAllAudit('audit')
        .then((response) => {
          const allAudits = response.data;
          const filteredAudits = allAudits
            .filter((audit: Audit) => audit.idTipoAuditoria.id !== 9)
            .sort((a: Audit, b: Audit) => b.id - a.id);

          const startIndex = 0;
          const endIndex = page * ITEMS_PER_PAGE;
          const paginatedAudits = filteredAudits.slice(startIndex, endIndex);

          setInternasAudits(paginatedAudits);
          setHasMore(endIndex < filteredAudits.length);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error in InternasScreen:', error);
          setInternasAudits([]);
          setLoading(false);
          setErrorMessage('Error al procesar la solicitud');
        });
    }, 100);
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 50);

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        ref={scrollRef}
        style={styles.screenContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.contentPadding}>
          {internasAudits.map((audit) => (
            <AuditCard
              key={audit.id}
              title={audit.idTipoAuditoria.auditType}
              auditNumber={audit.id}
              date={audit.auditDate}
              status={audit.idAuditado?.id === 1 ? 'AUDITADO' : 'SIN AUDITAR'}
              auditType={audit.idTipoAuditoria.id === 9 ? 'AFIP' : 'Interna'}
              auditId={audit.id}
              onPressDetail={() => {
                console.log('Detail pressed for audit:', audit.id);
              }}
            />
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00004b" />
            </View>
          )}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
      {showScrollTop && <ScrollToTopButton scrollViewRef={scrollRef} />}
    </View>
  );
}

function AfipScreen({ scrollRef }: { scrollRef: React.RefObject<ScrollView> }) {
  const { isAuthenticated } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [afipAudits, setAfipAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setAfipAudits([]);
      setLoading(false);
    }
  }, [page, isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);

    setTimeout(() => {
      auditService
        .fetchAllAudit('audit')
        .then((response) => {
          const allAudits = response.data;
          const filteredAudits = allAudits
            .filter((audit: Audit) => audit.idTipoAuditoria.id === 9)
            .sort((a: Audit, b: Audit) => b.id - a.id);

          const startIndex = 0;
          const endIndex = page * ITEMS_PER_PAGE;
          const paginatedAudits = filteredAudits.slice(startIndex, endIndex);

          setAfipAudits(paginatedAudits);
          setHasMore(endIndex < filteredAudits.length);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error in AfipScreen:', error);
          setAfipAudits([]);
          setLoading(false);
          setErrorMessage('Error al procesar la solicitud');
        });
    }, 100);
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 50);

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        ref={scrollRef}
        style={styles.screenContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.contentPadding}>
          {afipAudits.map((audit) => (
            <AuditCard
              key={audit.id}
              title={audit.idTipoAuditoria.auditType}
              auditNumber={audit.id}
              date={audit.auditDate}
              status={audit.idAuditado?.id === 1 ? 'AUDITADO' : 'SIN AUDITAR'}
              auditType={audit.idTipoAuditoria.id === 9 ? 'AFIP' : 'Interna'}
              auditId={audit.id}
              onPressDetail={() => {
                console.log('Detail pressed for audit:', audit.id);
              }}
            />
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00004b" />
            </View>
          )}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
      {showScrollTop && <ScrollToTopButton scrollViewRef={scrollRef} />}
    </View>
  );
}

export default function AuditoriasScreen() {
  const [selectedType, setSelectedType] = useState<'internas' | 'afip'>(
    'internas'
  );
  const internasScrollRef = useRef<ScrollView>(null);
  const afipScrollRef = useRef<ScrollView>(null);

  const handleTabChange = (type: 'internas' | 'afip') => {
    setSelectedType(type);
    if (type === 'internas') {
      internasScrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      afipScrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedType === 'internas') {
        internasScrollRef.current?.scrollTo({ y: 0, animated: true });
      } else {
        afipScrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, [selectedType])
  );

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            selectedType === 'internas' && styles.selectedOption,
          ]}
          onPress={() => handleTabChange('internas')}
        >
          <ThemedText
            style={[
              styles.toggleText,
              selectedType === 'internas' && styles.selectedText,
            ]}
          >
            Internas
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            selectedType === 'afip' && styles.selectedOption,
          ]}
          onPress={() => handleTabChange('afip')}
        >
          <ThemedText
            style={[
              styles.toggleText,
              selectedType === 'afip' && styles.selectedText,
            ]}
          >
            AFIP
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {selectedType === 'internas' ? (
          <InternasScreen
            scrollRef={internasScrollRef as React.RefObject<ScrollView>}
          />
        ) : (
          <AfipScreen
            scrollRef={afipScrollRef as React.RefObject<ScrollView>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    position: 'relative',
  },
  screenContainer: {
    flex: 1,
    paddingBottom: 32,
  },
  contentPadding: {
    paddingTop: 90,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 15,
    padding: 4,
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#00004b',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
  },
});
