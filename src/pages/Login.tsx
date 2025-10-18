import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const nav = useNavigate();


  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    
    if (mode === 'login') {
      const ok = await login(email, password);
      if (!ok) setError('Invalid credentials. Please check your email and password.');
      else nav('/');
    } else {
      const ok = await register(email, password, name || undefined);
      if (!ok) setError('Registration failed. Email may already be in use or domain not allowed.');
      else nav('/');
    }
  }


return (
<div className="max-w-md mx-auto mt-16 card p-6">
<h1 className="text-2xl font-bold">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
<p className="text-base-mute mt-1">
  {mode === 'login' 
    ? 'Use your institute email to access the discussion.' 
    : 'Register with your institute email to join the community.'}
</p>
<form onSubmit={onSubmit} className="mt-4 space-y-3">
  {mode === 'register' && (
    <input 
      className="input" 
      type="text" 
      placeholder="Your name" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      required 
    />
  )}
  <input 
    className="input" 
    type="email" 
    placeholder="name@kgpian.iitkgp.ac.in" 
    value={email} 
    onChange={(e) => setEmail(e.target.value)} 
    required 
  />
  <input 
    className="input" 
    type="password" 
    placeholder="Password" 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} 
    required 
    minLength={6}
  />
  {error && <p className="text-red-400 text-sm">{error}</p>}
  <button type="submit" className="btn-primary w-full">
    {mode === 'login' ? 'Sign In' : 'Create Account'}
  </button>
</form>
<div className="mt-4 text-center">
  <button 
    type="button"
    onClick={() => {
      setMode(mode === 'login' ? 'register' : 'login');
      setError("");
    }}
    className="text-sm text-accent hover:underline"
  >
    {mode === 'login' 
      ? "Don't have an account? Register here" 
      : 'Already have an account? Sign in'}
  </button>
</div>
<p className="text-xs text-base-mute mt-3">
  Email/password authentication for secure access. Only @kgpian.iitkgp.ac.in and @interiit.org domains allowed.
</p>
</div>
);
}