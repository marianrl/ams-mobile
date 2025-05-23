import { ChartCard } from '@/components/ChartCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UsuarioScreen() {
  // Mock data
  const firstName = 'Juan';
  const fullName = 'Juan Pérez';
  const email = 'juan.perez@email.com';
  const role = 'Administrador';

  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setModalVisible(false);
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top Half */}
      <View style={styles.topHalf}>
        <View style={styles.centeredContent}>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.avatar}
          />
          <Text style={styles.firstName}>{firstName}</Text>
          <Text style={styles.fullName}>{fullName}</Text>
        </View>
      </View>
      {/* Bottom Half */}
      <View style={styles.bottomHalf}>
        <ChartCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre y Apellido: </Text>
            <Text style={styles.value}>{fullName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rol: </Text>
            <Text style={styles.value}>{role}</Text>
          </View>
        </ChartCard>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalText}>
              Esta seguro que quiere cerrar sesion?
            </Text>
            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>SI</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>NO</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topHalf: {
    flex: 1,
    backgroundColor: '#00004b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  firstName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 4,
  },
  fullName: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  infoCard: {
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 4,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 16,
  },
  value: {
    color: '#222',
    fontSize: 16,
    flexShrink: 1,
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#fc5151',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#00004b',
  },
  modalButtonYes: {
    backgroundColor: '#fc5151',
  },
  modalButtonNo: {
    backgroundColor: '#aaa',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
