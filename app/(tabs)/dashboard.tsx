import { ChartCard } from '@/components/ChartCard';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';

export default function DashboardScreen() {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 140;

  const lineData = [
    { value: 50, label: 'Ene' },
    { value: 80, label: 'Feb' },
    { value: 90, label: 'Mar' },
    { value: 70, label: 'Abr' },
    { value: 85, label: 'May' },
  ];

  const pieData1 = [
    { value: 30, color: '#FF6B6B', text: '30%' },
    { value: 70, color: '#4ECDC4', text: '70%', focused: true },
  ];

  const pieData2 = [
    { value: 40, color: '#FFD93D', text: '40%' },
    { value: 60, color: '#6C5CE7', text: '60%', focused: true },
  ];

  const barData = [
    { value: 250, label: '2021', frontColor: '#4ECDC4' },
    { value: 500, label: '2022', frontColor: '#4ECDC4' },
    { value: 745, label: '2023', frontColor: '#4ECDC4' },
    { value: 320, label: '2024', frontColor: '#4ECDC4' },
    { value: 600, label: '2025', frontColor: '#4ECDC4' },
  ];

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  };

  return (
    <ScrollView style={styles.container}>
      <ChartCard title="Tendencia de Actividades" style={shadowStyle}>
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
          noOfSections={5}
          maxValue={100}
          backgroundColor="transparent"
          showVerticalLines
        />
      </ChartCard>

      <View style={styles.row}>
        <ChartCard
          style={[styles.halfWidth, shadowStyle]}
          title="Auditorías internas Completadas"
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
        </ChartCard>
        <ChartCard
          style={[styles.halfWidth, shadowStyle]}
          title="Auditorias AFIP completadas"
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
          noOfSections={5}
          maxValue={1000}
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
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  lastCard: {
    marginBottom: 32,
  },
});
