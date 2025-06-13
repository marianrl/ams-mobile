import { AuditCard } from '@/components/AuditCard';
import { ChartCard } from '@/components/ChartCard';
import { ThemedView } from '@/components/ThemedView';
import { auditService } from '@/services/audit-service';
import { Audit } from '@/types/audit';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';

const MONTH_NAMES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

export default function ReportesScreen() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [totalAudits, setTotalAudits] = useState(0);
  const [completedAudits, setCompletedAudits] = useState(0);
  const [pendingAudits, setPendingAudits] = useState(0);
  const [chartData, setChartData] = useState<
    Array<{
      value: number;
      label: string;
      frontColor: string;
    }>
  >([]);
  const [pieData, setPieData] = useState<
    Array<{
      value: number;
      color: string;
      text: string;
    }>
  >([]);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [lastAudits, setLastAudits] = useState<Audit[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 140;

  const getLastFiveMonths = () => {
    const result = [];
    const currentDate = new Date();

    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      result.push(MONTH_NAMES[monthIndex]);
    }

    return result;
  };

  const handleGenerateReport = async () => {
    try {
      const response = await auditService.fetchAllAudit('audit');
      const audits: Audit[] = response.data;

      const filteredAudits = audits.filter((audit) => {
        const auditDate = new Date(audit.auditDate);
        if (startDate && endDate) {
          return auditDate >= startDate && auditDate <= endDate;
        }
        return true;
      });

      const sortedAudits = [...filteredAudits].sort((a, b) => b.id - a.id);
      setLastAudits(sortedAudits.slice(0, 5));

      const total = filteredAudits.length;
      const completed = filteredAudits.filter(
        (audit) => audit.idAuditado.id === 1
      ).length;
      const pending = filteredAudits.filter(
        (audit) => audit.idAuditado.id !== 1
      ).length;

      const months = getLastFiveMonths();
      const chartData = months.map((month) => {
        const monthAudits = filteredAudits.filter((audit) => {
          const auditDate = new Date(audit.auditDate);
          return MONTH_NAMES[auditDate.getMonth()] === month;
        });

        return {
          value: monthAudits.length,
          label: month,
          frontColor: '#00004b',
        };
      });

      const internalAudits = filteredAudits.filter(
        (audit) => audit.idTipoAuditoria.id !== 9
      ).length;
      const afipAudits = filteredAudits.filter(
        (audit) => audit.idTipoAuditoria.id === 9
      ).length;

      const pieChartData = [
        {
          value: internalAudits,
          color: '#4ECDC4',
          text: 'Internas',
          focused: internalAudits >= afipAudits,
        },
        {
          value: afipAudits,
          color: '#FF6B6B',
          text: 'AFIP',
          focused: afipAudits > internalAudits,
        },
      ];

      setTotalAudits(total);
      setCompletedAudits(completed);
      setPendingAudits(pending);
      setChartData(chartData);
      setPieData(pieChartData);
      setReportGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.dateContainer}>
          <Text style={styles.sectionTitle}>Seleccionar rango de fechas</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {startDate ? formatDate(startDate) : 'Fecha de inicio'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {endDate ? formatDate(endDate) : 'Fecha final'}
            </Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
              negativeButton={{ label: 'Cancelar' }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={startDate || undefined}
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
              negativeButton={{ label: 'Cancelar' }}
            />
          )}

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateReport}
          >
            <Text style={styles.generateButtonText}>Generar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total</Text>
            <Text style={styles.cardValue}>{totalAudits}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Completadas</Text>
            <Text style={styles.cardValue}>{completedAudits}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pendientes</Text>
            <Text style={styles.cardValue}>{pendingAudits}</Text>
          </View>
        </View>

        {reportGenerated && (
          <>
            <ChartCard
              title="Tendencias de auditorias"
              style={styles.chartCard}
            >
              <BarChart
                data={chartData}
                barWidth={22}
                spacing={24}
                hideRules={false}
                rulesColor="#E5E5E5"
                rulesType="solid"
                xAxisThickness={1}
                yAxisThickness={1}
                yAxisTextStyle={{ color: '#000000' }}
                xAxisLabelTextStyle={{ color: '#000000' }}
                noOfSections={5}
                maxValue={Math.max(...chartData.map((item) => item.value), 10)}
                width={chartWidth}
                height={200}
                initialSpacing={20}
                endSpacing={20}
              />
            </ChartCard>

            <View style={styles.distributionContainer}>
              <ChartCard
                title="Distribución de auditorias"
                style={[styles.chartCard, styles.pieChartCard]}
              >
                <View style={styles.pieChartContainer}>
                  <PieChart
                    data={pieData}
                    showText
                    textColor="white"
                    radius={85}
                    focusOnPress
                    showValuesAsLabels
                    sectionAutoFocus
                    textSize={14}
                  />
                </View>
              </ChartCard>

              <View style={styles.distributionCounters}>
                <View style={styles.distributionCard}>
                  <Text style={styles.distributionCardTitle}>Internas</Text>
                  <Text
                    style={[styles.distributionCardValue, { color: '#4ECDC4' }]}
                  >
                    {pieData.find((item) => item.text === 'Internas')?.value ||
                      0}
                  </Text>
                </View>

                <View style={styles.distributionCard}>
                  <Text style={styles.distributionCardTitle}>AFIP</Text>
                  <Text
                    style={[styles.distributionCardValue, { color: '#FF6B6B' }]}
                  >
                    {pieData.find((item) => item.text === 'AFIP')?.value || 0}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.lastAuditsContainer}>
              <Text style={styles.sectionTitle}>Últimas auditorías</Text>
              {lastAudits.map((audit) => (
                <AuditCard
                  key={audit.id}
                  title={audit.idTipoAuditoria.auditType}
                  auditNumber={audit.id}
                  date={new Date(audit.auditDate).toLocaleDateString()}
                  status={
                    audit.idAuditado?.id === 1 ? 'AUDITADO' : 'SIN AUDITAR'
                  }
                  auditType={
                    audit.idTipoAuditoria.id === 9 ? 'AFIP' : 'Interna'
                  }
                  auditId={audit.id}
                  onPressDetail={() => {}}
                />
              ))}
            </View>
          </>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  dateContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#00004b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00004b',
  },
  chartCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  distributionContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
    height: 250,
  },
  pieChartCard: {
    flex: 0.7,
    marginTop: 0,
    height: '100%',
  },
  distributionCounters: {
    flex: 0.3,
    justifyContent: 'space-between',
    height: '100%',
  },
  distributionCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    height: '48%',
    minHeight: 100,
  },
  distributionCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  distributionCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  lastAuditsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  auditCardWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  auditTypePill: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  auditTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
