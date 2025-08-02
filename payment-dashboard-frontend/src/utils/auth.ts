import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

// ======================================================
// File: src/utils/auth.ts
// This utility handles storing and retrieving the JWT token securely.
// ======================================================
const TOKEN_KEY = 'access_token';

/**
 * Stores the JWT token securely.
 * @param token The JWT token to store.
 */
export const storeToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Failed to store the token:', error);
  }
};

/**
 * Retrieves the JWT token from secure storage.
 * @returns The stored token or null if not found.
 */
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get the token:', error);
    return null;
  }
};

/**
 * Removes the JWT token from secure storage.
 */
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Token removed successfully');
  } catch (error) {
    console.error('Failed to remove the token:', error);
  }
};
