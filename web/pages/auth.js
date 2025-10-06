import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [action, setAction] = useState('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: action === 'register' ? name : undefined })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message || 'Success!');
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        setMessage(data.message || data.error || 'An error occurred');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>forjustice.ca - {action === 'login' ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {action === 'register' && (
          <input 
            placeholder="Name (optional)" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ padding: '0.5rem' }}
          />
        )}
        <input 
          type="email"
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required
          minLength={8}
          style={{ padding: '0.5rem' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : (action === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
      <button 
        onClick={() => {
          setAction(action === 'login' ? 'register' : 'login');
          setMessage('');
        }}
        style={{ marginTop: '1rem', padding: '0.5rem', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}
      > 
        Switch to {action === 'login' ? 'Register' : 'Login'}
      </button>
      {message && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: message.includes('error') || message.includes('Invalid') ? '#fee' : '#efe', borderRadius: '4px' }}>
          {message}
        </div>
      )}
    </main>
  );
}