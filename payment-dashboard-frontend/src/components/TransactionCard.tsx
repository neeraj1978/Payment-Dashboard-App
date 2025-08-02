import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getPayments } from '../services/api';
import { useRouter } from 'expo-router';

// ======================================================
// File: src/components/TransactionCard.tsx (Included for self-contained code)
// ======================================================
const statusColors = {
  'success': '#4caf50',
  'failed': '#f44336',
  'pending': '#ff9800',
};

type StatusType = keyof typeof statusColors;

interface TransactionItem {
  _id: string;
  receiver: string;
  amount: number;
  createdAt: string;
  status: StatusType | string;
}

interface TransactionCardProps {
  item: TransactionItem;
  onPress: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item._id)}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.receiver}</Text>
      <Text style={styles.cardAmount}>${item.amount.toFixed(2)}</Text>
    </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status as StatusType] || '#9e9e9e' }]}>
      <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status as StatusType] || '#9e9e9e' }]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  cardDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
});