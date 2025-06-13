import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { ChartCard } from './ChartCard';
import { ThemedText } from './ThemedText';

interface AuditCardProps extends ViewProps {
  title: string;
  auditNumber: number;
  date: string;
  status: 'AUDITADO' | 'SIN AUDITAR';
  onPressDetail?: () => void;
  auditType?: 'AFIP' | 'Interna';
}

export function AuditCard({
  title,
  auditNumber,
  date,
  status,
  onPressDetail,
  auditType,
  style,
  ...props
}: AuditCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AUDITADO':
        return '#4CAF50';
      case 'SIN AUDITAR':
        return '#FF5252';
      default:
        return '#4CAF50';
    }
  };

  const getAuditTypeColor = (type: string) => {
    switch (type) {
      case 'AFIP':
        return '#9C27B0';
      case 'Interna':
        return '#4ECDC4';
      default:
        return '#4ECDC4';
    }
  };

  return (
    <View style={[styles.cardContainer, style]} {...props}>
      <ChartCard style={[styles.shadow, styles.card]}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardLabel}>
          N° DE AUDITORIA: {auditNumber}
        </ThemedText>
        <ThemedText style={styles.cardLabel}>FECHA: {date}</ThemedText>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.detailButton} onPress={onPressDetail}>
            <ThemedText style={styles.detailButtonText}>VER DETALLE</ThemedText>
          </TouchableOpacity>
          <View style={styles.pillsContainer}>
            {auditType && (
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: getAuditTypeColor(auditType) },
                ]}
              >
                <ThemedText style={styles.statusText}>{auditType}</ThemedText>
              </View>
            )}
            <View
              style={[
                styles.statusPill,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <ThemedText style={styles.statusText}>{status}</ThemedText>
            </View>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
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
