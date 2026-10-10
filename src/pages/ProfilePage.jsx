// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfileByUsername } from "../api/profile";

export default function ProfilePage() {
    const { username: usernameParam } = useParams();
    const { profile: myProfile, logout } = useAuth();
    const username = usernameParam?.startsWith("@") ? usernameParam.slice(1) : usernameParam;

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
        setLoading(true);
        setError(null);
        try {
            const response = await getProfileByUsername(username);
            setProfile(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }
        loadProfile();
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!profile) return null;

    const isOwnProfile = myProfile?.username === profile.username;

    return (
        <div>
        <h1>@{profile.username}</h1>
        <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>

        {isOwnProfile && (
            <button onClick={logout}>Log out</button>
        )}
        </div>
    );
}