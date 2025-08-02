import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://10.140.20.8:3000';


export const login = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

// Example getToken implementation; replace with your actual logic as needed
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync('access_token');
  } catch (error) {
    console.error('Failed to get the token:', error);
    return null;
  }
};

export const getPaymentStats = async () => {
  const token = await getToken();
  if (!token) throw new Error('No authentication token found.');

  const response = await fetch(`${BASE_URL}/payments/stats`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch payment stats');
  }
  return response.json();
};


export const getPaymentById = async (id: string) => {
  const token = await getToken();
  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${BASE_URL}/payments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to fetch payment with ID ${id}`);
  }

  return response.json();
};

export const getPayments = async (filters: any = {}) => {
  const token = await getToken();
  if (!token) throw new Error('No authentication token found.');

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );

  const queryString = new URLSearchParams(cleanedFilters as any).toString();
  const response = await fetch(`${BASE_URL}/payments?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch payments');
  }
  return response.json();
};


export const createPayment = async (paymentData: { amount: number; receiver: string; status: string; method: string; }) => {
    const token = await getToken();
    if (!token) throw new Error('No authentication token found.');

    const response = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
    }
    return response.json();
};
