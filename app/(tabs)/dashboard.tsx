import { ChartCard } from '@/components/ChartCard';
import { ThemedText } from '@/components/ThemedText';
import { auditService } from '@/services/audit-service';
import { Audit } from '@/types/audit';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';

export default function DashboardScreen() {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 140;
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await auditService.fetchAllAudit('audit');
      setAudits(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audits:', error);
      setLoading(false);
    }
  };

  const getMonthlyTrendData = () => {
    const months = [
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
    ];
    const currentDate = new Date();
    const last5Months = [];

    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const year =
        currentDate.getFullYear() - (currentDate.getMonth() - i < 0 ? 1 : 0);

      const monthAudits = audits.filter((audit) => {
        const auditDate = new Date(audit.auditDate);
        return (
          auditDate.getMonth() === monthIndex &&
          auditDate.getFullYear() === year
        );
      });

      last5Months.push({
        value: monthAudits.length,
        label: months[monthIndex],
      });
    }

    return last5Months;
  };

  const getAuditTypeData = () => {
    const internalAudits = audits.filter(
      (audit) => audit.idTipoAuditoria.id !== 9
    );
    const afipAudits = audits.filter((audit) => audit.idTipoAuditoria.id === 9);

    const internalCompleted = internalAudits.filter(
      (audit) => audit.idAuditado?.id === 1
    ).length;
    const afipCompleted = afipAudits.filter(
      (audit) => audit.idAuditado?.id === 1
    ).length;

    return {
      internal: [
        {
          value: internalCompleted,
          color: '#4ECDC4',
          text: `${Math.round(
            (internalCompleted / internalAudits.length) * 100
          )}%`,
        },
        {
          value: internalAudits.length - internalCompleted,
          color: '#FF6B6B',
          text: `${Math.round(
            ((internalAudits.length - internalCompleted) /
              internalAudits.length) *
              100
          )}%`,
          focused: true,
        },
      ],
      afip: [
        {
          value: afipCompleted,
          color: '#4ECDC4',
          text: `${Math.round((afipCompleted / afipAudits.length) * 100)}%`,
        },
        {
          value: afipAudits.length - afipCompleted,
          color: '#9C27B0',
          text: `${Math.round(
            ((afipAudits.length - afipCompleted) / afipAudits.length) * 100
          )}%`,
          focused: true,
        },
      ],
    };
  };

  const getAnnualVolumeData = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

    return years.map((year) => {
      const yearAudits = audits.filter((audit) => {
        const auditDate = new Date(audit.auditDate);
        return auditDate.getFullYear() === year;
      });
      return {
        value: yearAudits.length,
        label: year.toString(),
        frontColor: '#4ECDC4',
      };
    });
  };

  const lineData = getMonthlyTrendData();
  const { internal: pieData1, afip: pieData2 } = getAuditTypeData();
  const barData = getAnnualVolumeData();

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  };

  if (loading) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <ChartCard
        title="Tendencia de Actividades"
        style={[shadowStyle, styles.firstCard]}
      >
        <LineChart
          data={lineData}
          height={160}
          width={chartWidth}
          spacing={chartWidth / 4}
          initialSpacing={20}
          endSpacing={20}
          color="#00004b"
          thickness={2}
          hideDataPoints={false}
          dataPointsColor="#00004b"
          dataPointsRadius={4}
          xAxisColor="#000000"
          yAxisColor="#000000"
          yAxisTextStyle={{ color: '#000000' }}
          hideRules={false}
          rulesColor="#E5E5E5"
          rulesType="solid"
          noOfSections={Math.ceil(Math.max(...lineData.map((d) => d.value)))}
          maxValue={Math.ceil(Math.max(...lineData.map((d) => d.value)))}
          backgroundColor="transparent"
          showVerticalLines
        />
      </ChartCard>

      <View style={styles.row}>
        <ChartCard
          style={[styles.halfWidth, shadowStyle]}
          title="Auditorías internas"
        >
          <PieChart
            data={pieData1}
            showText
            textColor="white"
            radius={70}
            focusOnPress
            showValuesAsLabels
            sectionAutoFocus
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]}
              />
              <ThemedText style={styles.legendText}>Auditadas</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]}
              />
              <ThemedText style={styles.legendText}>Sin auditar</ThemedText>
            </View>
          </View>
        </ChartCard>
        <ChartCard
          style={[styles.halfWidth, shadowStyle]}
          title="Auditorías AFIP"
        >
          <PieChart
            data={pieData2}
            showText
            textColor="white"
            radius={70}
            focusOnPress
            showValuesAsLabels
            sectionAutoFocus
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]}
              />
              <ThemedText style={styles.legendText}>Auditadas</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#9C27B0' }]}
              />
              <ThemedText style={styles.legendText}>Sin auditar</ThemedText>
            </View>
          </View>
        </ChartCard>
      </View>

      <ChartCard
        style={[styles.lastCard, shadowStyle]}
        title="Volumen anual de auditorias"
      >
        <BarChart
          data={barData}
          barWidth={22}
          spacing={24}
          hideRules={false}
          rulesColor="#E5E5E5"
          rulesType="solid"
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{ color: '#000000' }}
          xAxisLabelTextStyle={{ color: '#000000' }}
          noOfSections={Math.ceil(Math.max(...barData.map((d) => d.value)) / 5)}
          maxValue={Math.ceil(Math.max(...barData.map((d) => d.value)) / 5) * 5}
          width={chartWidth}
          height={160}
          initialSpacing={20}
          endSpacing={20}
        />
      </ChartCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  firstCard: {
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    margin: 16,
  },
  halfWidth: {
    flex: 1,
  },
  lastCard: {
    margin: 16,
    marginBottom: 32,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
  },
});
