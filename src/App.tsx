import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";


export default function App() {
return (
<BrowserRouter>
<Header />
<Layout>
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
</Routes>
</Layout>
</BrowserRouter>
);
}