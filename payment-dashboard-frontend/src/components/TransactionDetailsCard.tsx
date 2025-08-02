// components/TransactionDetailsCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Helper function to get status color
const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#16a34a'; // Green
      case 'failed': return '#dc2626'; // Red
      case 'pending': return '#f97316'; // Orange
      default: return '#6b7280'; // Gray
    }
};

// Detail Row Component for cleaner code
type DetailRowProps = {
    label: string;
    value: string;
    valueColor?: string;
};

const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueColor }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color: valueColor || '#1f2937' }]}>{value}</Text>
    </View>
);

type Transaction = {
  amount: number;
  status: string;
  receiver: string;
  method: string;
  createdAt: string;
  _id: string;
};

type TransactionDetailsCardProps = {
  transaction: Transaction;
};

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({ transaction }) => {
  // Agar kisi vajah se transaction data na mile to fallback UI
  if (!transaction) {
    return <Text style={styles.errorText}>Transaction data not available.</Text>;
  }

  return (
    <View style={styles.card}>
        <View style={styles.header}>
            <Text style={styles.headerAmount}>₹{transaction.amount.toFixed(2)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
                <Text style={styles.statusText}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Text>
            </View>
        </View>
        <DetailRow label="Receiver" value={transaction.receiver} />
        <DetailRow label="Payment Method" value={transaction.method} />
        <DetailRow label="Transaction Date" value={formatDate(transaction.createdAt)} />
        <DetailRow label="Transaction ID" value={transaction._id} />
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb', // gray-200
    },
    headerAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#111827', // gray-900
    },
    statusBadge: {
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6', // gray-100
    },
    detailLabel: {
        fontSize: 16,
        color: '#6b7280', // gray-500
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        flexShrink: 1, // Text ko wrap hone dega agar lamba hai
        textAlign: 'right',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
        fontSize: 16,
    },
});

export default TransactionDetailsCard;
