import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    const res = await fetch(`http://localhost:3001/auth/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(data.message || '');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Login / Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ width: 200 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ width: 200 }} />
      <Button title={action === 'login' ? 'Login' : 'Register'} onPress={handleSubmit} />
      <Button title={`Switch to ${action === 'login' ? 'Register' : 'Login'}`} onPress={() => setAction(action === 'login' ? 'register' : 'login')} />
      <Text>{message}</Text>
    </View>
  );
}