import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { userService } from '../services/user-service';
import { UserRequest } from '../types/user_request';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userRequest: UserRequest = {
        mail: usuario,
        password: contrasena,
      };
      const status = await userService.fetchUserByMailAndPassword(
        'user/authenticate',
        userRequest
      );
      const token = await AsyncStorage.getItem('authToken');
      if (status === 200 && token) {
        const decodedToken = jwtDecode(token.replace('Bearer ', ''));
        router.replace('/dashboard');
        return;
      } else if (status === 401) {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#00004b" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#00004b' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.welcome}>Bienvenido/a</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#888"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Audit Management Studio® 2025. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    backgroundColor: '#00004b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 120,
  },
  bottomSection: {
    flex: 2,
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 32,
    marginBottom: 32,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 24,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#222',
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  button: {
    backgroundColor: '#00004b',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
  },
  footerContainer: {
    backgroundColor: '#fafafa',
    paddingVertical: 12,
  },
});
