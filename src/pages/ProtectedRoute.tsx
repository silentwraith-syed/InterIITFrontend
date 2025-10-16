import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";


export default function ProtectedRoute({ children }: { children: ReactElement }) {
const { isAuthed } = useAuth();
if (!isAuthed) return <Navigate to="/login" replace />;
return children;
}