import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();


  async function onSubmit(e: FormEvent) {
e.preventDefault()
const ok = await login(email, name || undefined)
if (!ok) setError('Access restricted or server error. Use an approved domain.')
else nav('/')
}


return (
<div className="max-w-md mx-auto mt-16 card p-6">
<h1 className="text-2xl font-bold">Sign in</h1>
<p className="text-base-mute mt-1">Use your institute email to access the discussion.</p>
<form onSubmit={onSubmit} className="mt-4 space-y-3">
<input className="input" type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
<input className="input" type="email" placeholder="name@iit.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
{error && <p className="text-red-400 text-sm">{error}</p>}
<button type="submit" className="btn-primary w-full">Continue</button>
</form>
<p className="text-xs text-base-mute mt-3">Demo only – no password, just domain check. Replace with real auth later.</p>
</div>
);
}