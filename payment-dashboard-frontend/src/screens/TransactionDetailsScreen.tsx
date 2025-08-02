import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getToken } from '../utils/auth';

// Define the payment type
interface Payment {
  _id: string;
  amount: number;
  receiver: string;
  status: string;
  method: string;
  createdAt: string;
  updatedAt: string;
}

// Define route params
type RouteParams = {
  params: {
    transactionId: string;
  };
};

export default function TransactionDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { transactionId } = route.params;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPaymentDetails = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`http://10.140.20.8:3000/payments/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch payment details');
      }

      const data = await res.json();
      setPayment(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to load payment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#0000ff" />;
  }

  if (!payment) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Payment not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹ {payment.amount}</Text>

        <Text style={styles.label}>Receiver:</Text>
        <Text style={styles.value}>{payment.receiver}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{payment.status}</Text>

        <Text style={styles.label}>Method:</Text>
        <Text style={styles.value}>{payment.method}</Text>

        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>{new Date(payment.createdAt).toLocaleString()}</Text>

        <Text style={styles.label}>Last Updated:</Text>
        <Text style={styles.value}>{new Date(payment.updatedAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff0f3', // Light pink background
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#880e4f', // Deep pink
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffe6e9', // Very light pink card
    borderRadius: 16,
    padding: 18,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // Shadow for Android
    elevation: 5,
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    color: '#d32f2f', // Reddish label
    marginTop: 14,
  },
  value: {
    fontSize: 17,
    color: '#333',
    paddingVertical: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f3',
  },
  error: {
    fontSize: 18,
    color: '#b00020', // dark red error
  },
});
