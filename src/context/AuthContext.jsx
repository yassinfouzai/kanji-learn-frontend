// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { registerProfile, loginProfile } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedProfile = localStorage.getItem("profile");
        if (storedToken && storedProfile) {
        setToken(storedToken);
        setProfile(JSON.parse(storedProfile));
        }
        setLoading(false);
    }, []);

    function persistSession(data) {
        setToken(data.token);
        setProfile(data.profile);
        localStorage.setItem("token", data.token);
        localStorage.setItem("profile", JSON.stringify(data.profile));
    }

    async function login(username, password) {
        const response = await loginProfile(username, password);
        persistSession(response.data);
    }

    async function register(username, password) {
        const response = await registerProfile(username, password);
        persistSession(response.data);
    }

    function logout() {
        setToken(null);
        setProfile(null);
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
    }

    return (
        <AuthContext.Provider value={{ token, profile, loading, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    return useContext(AuthContext);
}