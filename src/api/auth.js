// src/api/auth.js
import { apiRequest } from "./client";

export function registerProfile(username, password) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: { username, password },
    });
    }

    export function loginProfile(username, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: { username, password },
    });
}