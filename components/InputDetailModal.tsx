import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AfipInput } from '../types/afipInput';
import { CommonInput } from '../types/commonInput';
import { ThemedText } from './ThemedText';

type Input = AfipInput | CommonInput;

interface InputDetailModalProps {
  input: Input;
  onClose: () => void;
}

export function InputDetailModal({ input, onClose }: InputDetailModalProps) {
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get('window').height)
  ).current;
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0; // Only respond to downward gestures
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow downward movement
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > screenHeight * 0.2) {
          // If dragged down more than 20% of screen height
          handleClose();
        } else {
          // Snap back to original position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View style={styles.detailRow}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );

  return (
    <View style={styles.overlay}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
      <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: slideAnim }],
            height: screenHeight * 0.8,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <View style={styles.handle} />
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color="#00004b" />
        </TouchableOpacity>

        <ThemedText style={styles.title}>
          {input.lastName}, {input.name}
        </ThemedText>

        <View style={styles.detailsContainer}>
          <DetailRow label="CUIL" value={input.cuil} />
          <DetailRow label="N° Legajo" value={input.file} />
          <DetailRow label="Asignacion" value={input.allocation} />
          <DetailRow label="Cliente" value={input.client?.client || 'N/A'} />
          <DetailRow label="UOC" value={input.uoc} />
          <DetailRow label="Sucursal" value={input.branch?.branch || 'N/A'} />
          <DetailRow label="Fecha de Ingreso" value={input.admissionDate} />
          <DetailRow
            label="Fecha de la Auditoria"
            value={input.audit?.auditDate || 'N/A'}
          />
          <DetailRow
            label="Tipo de Auditoria"
            value={input.audit?.idTipoAuditoria?.auditType || 'N/A'}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00004b',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});
