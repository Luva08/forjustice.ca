import { useState } from 'react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('login');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/auth/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(data.message || '');
  }

  return (
    <main>
      <h1>Login / Register</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">{action === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setAction(action === 'login' ? 'register' : 'login')}> 
        Switch to {action === 'login' ? 'Register' : 'Login'}
      </button>
      <div>{message}</div>
    </main>
  );
}