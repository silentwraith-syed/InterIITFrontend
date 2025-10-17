import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { LogOut, MessageSquare } from "lucide-react";


export default function Header() {
const { isAuthed, email, logout } = useAuth();
const nav = useNavigate();
return (
<header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-base-bg/70">
<div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
<Link to="/" className="flex items-center gap-2">
<div className="w-8 h-8 rounded-xl bg-brand-primary grid place-items-center text-white font-bold">K</div>
<span className="font-semibold">KGPTalks</span>
</Link>
<div className="flex items-center gap-2">
{isAuthed ? (
<>
<span className="badge hidden sm:inline">{email}</span>
<button className="btn-ghost" onClick={() => { logout(); nav("/login"); }}>
<LogOut className="w-5 h-5" /> <span className="hidden sm:inline">Logout</span>
</button>
</>
) : (
<Link className="btn-primary" to="/login">
<MessageSquare className="w-5 h-5" /> Login
</Link>
)}
</div>
</div>
</header>
);
}