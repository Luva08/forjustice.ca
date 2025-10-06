import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001/api/v1';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [action, setAction] = useState('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name: action === 'register' ? name : undefined 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || 'Success!');
        if (data.token) {
          // Store token securely (use expo-secure-store in production)
          // await SecureStore.setItemAsync('token', data.token);
          Alert.alert('Success', data.message);
        }
      } else {
        setMessage(data.message || data.error || 'An error occurred');
        Alert.alert('Error', data.message || data.error || 'An error occurred');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>forjustice.ca</Text>
      <Text style={styles.subtitle}>
        {action === 'login' ? 'Login' : 'Register'}
      </Text>
      
      {action === 'register' && (
        <TextInput 
          placeholder="Name (optional)" 
          value={name} 
          onChangeText={setName} 
          style={styles.input}
        />
      )}
      
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input}
        autoCapitalize="none"
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0070f3" />
      ) : (
        <Button 
          title={action === 'login' ? 'Login' : 'Register'} 
          onPress={handleSubmit}
          color="#0070f3"
        />
      )}
      
      <Button 
        title={`Switch to ${action === 'login' ? 'Register' : 'Login'}`} 
        onPress={() => {
          setAction(action === 'login' ? 'register' : 'login');
          setMessage('');
        }}
        color="#666"
      />
      
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
  },
  message: {
    marginTop: 20,
    padding: 10,
    color: '#333',
    textAlign: 'center',
  },
});