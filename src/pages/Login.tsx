import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { step, request, verify, resetStep } = useAuth();
  const nav = useNavigate();


  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === 'email') {
      const ok = await request(email, name || undefined);
      if (!ok) setError('Access restricted or server error. Use an approved domain.');
    } else {
      const ok = await verify(code);
      if (!ok) setError('Invalid code. Please try again.');
      else nav('/');
    }
  }

  function handleBack() {
    resetStep();
    setCode("");
    setError("");
  }


return (
<div className="max-w-md mx-auto mt-16 card p-6">
<h1 className="text-2xl font-bold">Sign in</h1>
<p className="text-base-mute mt-1">
  {step === 'email' ? 'Use your institute email to access the discussion.' : 'Enter the OTP sent to your email.'}
</p>
<form onSubmit={onSubmit} className="mt-4 space-y-3">
  {step === 'email' ? (
    <>
      <input className="input" type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input" type="email" placeholder="name@kgpian.iitkgp.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </>
  ) : (
    <>
      <input className="input" type="text" placeholder="Enter OTP code" value={code} onChange={(e) => setCode(e.target.value)} required />
      <button type="button" onClick={handleBack} className="btn-ghost w-full text-sm">
        ← Back to email
      </button>
    </>
  )}
  {error && <p className="text-red-400 text-sm">{error}</p>}
  <button type="submit" className="btn-primary w-full">Continue</button>
</form>
<p className="text-xs text-base-mute mt-3">OTP-based authentication for secure access.</p>
</div>
);
}