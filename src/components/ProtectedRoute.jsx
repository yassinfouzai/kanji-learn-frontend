// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const auth = useAuth();
    const token = auth?.token;
    const profile = auth?.profile;
    const loading = auth?.loading ?? true;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token || !profile) {
        return <Navigate to="/login" replace />;
    }

    return children;
}