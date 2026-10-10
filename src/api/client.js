// src/api/client.js

const BASE_URL = "http://localhost:8080/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${BASE_URL}${path}`;

    // Debug: log outgoing requests so pagination issues can be diagnosed
    try {
        // eslint-disable-next-line no-console
        console.debug("apiRequest ->", method, url, body ? { body } : null);
    } catch (e) {}

    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    // Safely handle empty responses or non-JSON bodies
    const text = await response.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch (e) {
            // non-JSON response (e.g., plain text or HTML)
            data = text;
        }
    }

    if (!response.ok) {
        if (response.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("profile");
                window.location.href = "/login";
            }
            throw new Error("Session expired. Please log in again.");
        }

        const message = (data && typeof data === 'object' && data.message) ? data.message : response.statusText || 'Something went wrong';
        throw new Error(message);
    }

    return data;
}