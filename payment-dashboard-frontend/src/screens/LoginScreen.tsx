import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert, Pressable } from 'react-native';
import { login } from '../services/api';
import { storeToken } from '../utils/auth';
import { useRouter } from 'expo-router';

// ======================================================
// File: src/screens/LoginScreen.tsx
// This is the main login screen component.
// It handles user input, calls the login API, and navigates on success.
// ======================================================
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call the login API from api.ts
      const response = await login(username, password);

      // Store the token securely
      await storeToken(response.access_token);
      
      setSuccess('Login Successful!'); // Success message set

      // Navigate to the Dashboard screen after a short delay to show the success message
      setTimeout(() => {
        router.push('/DashboardScreen');
      }, 1500);

    } catch (e) {
      if (e && typeof e === 'object' && 'message' in e) {
        setError((e as { message: string }).message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
  onPress={handleLogin}
  disabled={loading}
  style={{
    backgroundColor: loading ? '#ff99aa' : '#ff4d6d',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    opacity: loading ? 0.7 : 1,
  }}
>
  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
    {loading ? 'Logging in...' : 'Login'}
  </Text>
</Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffe6e9', // Soft pink background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#b3003c', // Deep reddish-pink title
  },
  input: {
    height: 48,
    borderColor: '#ff99aa', // Light pink border
    borderWidth: 1.5,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff0f5', // Very light pink input background
    color: '#333',
  },
  errorText: {
    color: '#cc0033', // Strong red tone
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    color: '#009966', // Slightly greenish for success
    textAlign: 'center',
    marginBottom: 10,
  },
});
