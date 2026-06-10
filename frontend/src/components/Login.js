import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isRegistering ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
        username,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isRegistering ? 'Join MoodVault today' : 'Sign in to access your MoodVault'}
          </p>
        </div>
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              required 
              placeholder="Enter your username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              required 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="submit-btn">
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="switch-auth">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="switch-link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;