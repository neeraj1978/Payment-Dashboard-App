import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ✅ स्टेप 1: टाइप्स को नई फाइल से इम्पोर्ट करें
import { RootStackParamList } from '../src/Navigation/type';

// ✅ स्टेप 2: स्क्रीन्स को सही पाथ से इम्पोर्ट करें
import DashboardScreen from '../src/screens/DashboardScreen';
import AddPaymentScreen from '../src/screens/AddPaymentScreen';
import TransactionListScreen from '../src/screens/TransactionListScreen';
import TransactionDetailsScreen from '../src/screens/TransactionDetailsScreen';

// ❌ RootStackParamList को यहाँ से हटा दिया गया है

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DashboardScreen">
        <Stack.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPaymentScreen"
          component={AddPaymentScreen}
          options={{ title: 'Add Payment' }}
        />
        <Stack.Screen
          name="TransactionListScreen"
          component={TransactionListScreen}
          options={{ title: 'All Transactions' }}
        />
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;