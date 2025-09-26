import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { auth } from "./firebaseConfig";
console.log("Firebase connected:", auth);


type AuthState = 'login' | 'signup' | 'authenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [username, setUsername] = useState('');

  const handleLogin = (success: boolean) => {
    if (success) {
      setUsername('demo_user'); // Mock username
      setAuthState('authenticated');
    }
  };

  const handleSignup = (success: boolean) => {
    if (success) {
      // After successful signup, redirect to login
      setAuthState('login');
      alert('Account created successfully! Please sign in.');
    }
  };

  const handleLogout = () => {
    setAuthState('login');
    setUsername('');
  };

  const switchToSignup = () => {
    setAuthState('signup');
  };

  const switchToLogin = () => {
    setAuthState('login');
  };

  if (authState === 'authenticated') {
    return <Dashboard onLogout={handleLogout} username={username} />;
  }

  if (authState === 'signup') {
    return (
      <SignupPage 
        onSignup={handleSignup} 
        onSwitchToLogin={switchToLogin} 
      />
    );
  }

  return (
    <LoginPage 
      onLogin={handleLogin} 
      onSwitchToSignup={switchToSignup} 
    />
  );
}