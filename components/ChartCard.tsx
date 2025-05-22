import { StyleSheet, Text, ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';

interface ChartCardProps extends ViewProps {
  title?: string;
}

export function ChartCard({
  children,
  style,
  title,
  ...props
}: ChartCardProps) {
  return (
    <ThemedView style={[styles.container, style]} {...props}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000000',
  },
});
