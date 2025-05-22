import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function UsuarioScreen() {
  return <ThemedView style={styles.container}></ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
