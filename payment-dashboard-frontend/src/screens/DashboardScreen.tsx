import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { getToken } from '../utils/auth';
import { RootStackParamList } from '../Navigation/type';



type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'DashboardScreen'>;

interface RevenueDay {
  date: string;
  revenue: number;
}

interface PaymentStatsResponse {
  totalPaymentsToday: number;
  totalPaymentsThisWeek: number;
  totalRevenue: number;
  failedTransactionsCount: number;
  revenueLast7Days: RevenueDay[];
}

const screenWidth = Dimensions.get('window').width;
const chartInnerWidth = screenWidth - 64;


const DashboardScreen: React.FC<DashboardScreenProps> = () => {
  const [stats, setStats] = useState<PaymentStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Authentication Error', 'User token not found');
        setLoading(false);
        return;
      }

      const res = await fetch('http://10.140.20.8:3000/payments/stats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      Alert.alert('Error', 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loaderText}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Could not load data. Please try again later.</Text>
      </View>
    );
  }

  const formattedChartData = {
    labels: stats.revenueLast7Days.map((item) =>
      new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short' }),
    ),
    datasets: [
      {
        data: stats.revenueLast7Days.map((item) => item.revenue),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Dashboard 📊</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <MetricCard title="Today's Payment" value={stats.totalPaymentsToday} />
          <MetricCard title="Payments in week" value={stats.totalPaymentsThisWeek} />
        </View>
        <View style={styles.metricRow}>
          <MetricCard title="Total revenue" value={`₹${stats.totalRevenue}`} />
          <MetricCard title="Failed transaction" value={stats.failedTransactionsCount} />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue in last 7 days</Text>
        <LineChart
          data={formattedChartData}
          width={chartInnerWidth}
          height={220}
          yAxisLabel="₹"
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.navContainer}>
        <NavCard title=" Click to Add New Payment" icon="💳" screenName="AddPaymentScreen" />
        <NavCard title="Click to View All Transactions" icon="🧾" screenName="TransactionListScreen" />
      </View>
    </ScrollView>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

type NavCardProps = {
  title: string;
  icon: string;
  screenName: keyof RootStackParamList;
};

const NavCard: React.FC<NavCardProps> = ({ title, icon, screenName }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      style={styles.navCard}
      onPress={() => navigation.navigate(screenName as any)}
    >
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={styles.navTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
  propsForDots: { r: '5', strokeWidth: '2', stroke: '#007aff' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#b3003b',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    width: '48%',
    borderWidth: 1.2,
    borderColor: '#ff4d6d',
    shadowColor: '#b3003b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,

  },
  metricTitle: {
    fontSize: 15,
    color: '#7a7a7a',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#b3003b',
  },
  chartContainer: {
  marginHorizontal: 20,
  backgroundColor: '#ffffff',
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 12, // NEW: added horizontal padding to control inner width
  alignItems: 'center',
  borderWidth: 1.5,
  borderColor: '#ff4d6d',
  shadowColor: '#b3003b',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 10,
  marginBottom: 24,
},
chart: {
  marginVertical: 8,
  borderRadius: 16,
  alignSelf: 'stretch', // fills available space
},

  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#b3003b',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  navCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#ff4d6d',
    shadowColor: '#b3003b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,

  },
  navIcon: {
    fontSize: 32,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    color: '#b3003b',
    textAlign: 'center',
  },
});


export default DashboardScreen;
