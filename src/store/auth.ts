import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
email: string | null;
name: string | null;
isAuthed: boolean;
login: (email: string, name?: string) => boolean;
logout: () => void;
}


const ALLOWED_DOMAINS = ["iit.ac.in", "interiit.org"]; // edit as needed


export const useAuth = create<AuthState>()(
persist(
(set) => ({
email: null,
name: null,
isAuthed: false,
login: (email: string, name = "Guest") => {
const domain = email.split("@")[1]?.toLowerCase();
const allowed = domain && ALLOWED_DOMAINS.includes(domain);
if (allowed) {
set({ email, name, isAuthed: true });
return true;
}
return false;
},
logout: () => set({ email: null, name: null, isAuthed: false }),
}),
{ name: "interiit-auth" }
)
);