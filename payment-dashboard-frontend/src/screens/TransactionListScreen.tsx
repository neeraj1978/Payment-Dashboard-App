import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Button,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getToken } from '../utils/auth';

interface Payment {
  _id: string;
  amount: number;
  receiver: string;
  status: string;
  method: string;
  createdAt: string;
}

export default function TransactionListScreen() {
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const fetchTransactions = async (reset = false) => {
    try {
      setLoading(true);
      const token = await getToken();

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (methodFilter) params.append('method', methodFilter);
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      params.append('page', reset ? '1' : page.toString());
      params.append('limit', '10');

      const response = await fetch(`http://10.140.20.8:3000/payments?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setTotal(data.total);
      setTransactions(reset ? data.payments : [...transactions, ...data.payments]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (transactions.length < total) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchTransactions(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(true);
    }, [statusFilter, methodFilter, startDate, endDate])
  );

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const renderItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('TransactionDetailsScreen', { transactionId: item._id })
      }>
      <Text style={styles.title}>₹ {item.amount}</Text>
      <Text>{item.receiver}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Method: {item.method}</Text>
      <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={statusFilter}
    onValueChange={value => setStatusFilter(value)}
    style={styles.picker}>
    <Picker.Item label="All Statuses" value="" />
    <Picker.Item label="Success" value="success" />
    <Picker.Item label="Failed" value="failed" />
    <Picker.Item label="Pending" value="pending" />
  </Picker>
    <Picker
          selectedValue={methodFilter}
          onValueChange={value => setMethodFilter(value)}
          style={styles.picker}>
          <Picker.Item label="All Methods" value="" />
          <Picker.Item label="UPI" value="upi" />
          <Picker.Item label="Card" value="card" />
          <Picker.Item label="Cash" value="cash" />
        </Picker>

        <View style={styles.dateRow}>
          <Text>From: {startDate?.toDateString() || 'Not selected'}</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setShowStartPicker(true)}>
  <Text style={styles.selectButtonText}>Select Start Date</Text>
</TouchableOpacity>

        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        <View style={styles.dateRow}>
          <Text>To: {endDate?.toDateString() || 'Not selected'}</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setShowEndPicker(true)}>
  <Text style={styles.selectButtonText}>Select End Date</Text>
</TouchableOpacity>

        </View>
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* List */}
      {loading && page === 1 ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff0f3', // light pink background
  },
  filters: {
    backgroundColor: '#ffe6e9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 40,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    color: '#880e4f', // deep pink text
    fontSize: 14,
  },
  dateRow: {
    marginVertical: 8,
    paddingVertical: 4,
  },
  dateText: {
    color: '#b71c1c',
    fontWeight: '600',
    marginBottom: 4,
  },
  selectButton: {
  backgroundColor: '#f06292', // reddish-pink
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignSelf: 'flex-start',
  marginTop: 6,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
selectButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#b71c1c',
  },
  pickerWrapper: {
  backgroundColor: '#f8bbd0', // light pink background
  borderRadius: 16,
  marginBottom: 10,
  paddingHorizontal: 10,
  paddingVertical: Platform.OS === 'ios' ? 6 : 0,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},


});

