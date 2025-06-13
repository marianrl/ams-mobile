import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { AfipInput } from '../types/afipInput';
import { CommonInput } from '../types/commonInput';
import { ChartCard } from './ChartCard';
import { ThemedText } from './ThemedText';

type Input = AfipInput | CommonInput;

interface InputCardProps extends ViewProps {
  input: Input;
  onPressDetail?: () => void;
}

export function InputCard({
  input,
  onPressDetail,
  style,
  ...props
}: InputCardProps) {
  return (
    <View style={[styles.cardContainer, style]} {...props}>
      <ChartCard style={[styles.shadow, styles.card]}>
        <ThemedText style={styles.cardTitle}>
          {input.lastName}, {input.name}
        </ThemedText>
        <ThemedText style={styles.cardLabel}>CUIL: {input.cuil}</ThemedText>
        <ThemedText style={styles.cardLabel}>
          N° Legajo: {input.file}
        </ThemedText>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.detailButton} onPress={onPressDetail}>
            <ThemedText style={styles.detailButtonText}>
              MAS DETALLES
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ChartCard>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 8,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    padding: 10,
    margin: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 2,
    color: '#666666',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  detailButton: {
    backgroundColor: '#00004b',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});
