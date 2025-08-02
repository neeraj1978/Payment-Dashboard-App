// src/screens/AddPaymentScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/type';
import { createPayment } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPaymentScreen'>;

const AddPaymentScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [status, setStatus] = useState('success');
  const [method, setMethod] = useState('');

  const handleSubmit = async () => {
    if (!amount || !receiver || !status || !method) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await createPayment({
        amount: parseFloat(amount),
        receiver,
        status,
        method,
      });

      Alert.alert('Success', 'Payment added successfully!');
      navigation.navigate('DashboardScreen');
    } catch (error: any) {
      console.error(error.message);
      Alert.alert('Error', error.message || 'Failed to create payment');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Receiver</Text>
      <TextInput
        style={styles.input}
        value={receiver}
        onChangeText={setReceiver}
        placeholder="Enter receiver"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="success / failed / pending"
      />

      <Text style={styles.label}>Method</Text>
      <TextInput
        style={styles.input}
        value={method}
        onChangeText={setMethod}
        placeholder="UPI / Cash / Card"
      />

      <View style={{ borderRadius: 10, overflow: 'hidden', marginTop: 20 }}>
  <Button
    title="Submit Payment"
    onPress={handleSubmit}
    color="#e63946" // Reddish-pink
  />
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff0f3', // Light pink background
    flexGrow: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 16,
    color: '#b71c1c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e57373',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#ffe6e9',
    color: '#333',
  },
});


export default AddPaymentScreen;
