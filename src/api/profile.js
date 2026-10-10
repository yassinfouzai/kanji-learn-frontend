// src/api/profile.js
import { apiRequest } from "./client";

export function getProfileByUsername(username) {
    return apiRequest(`/profiles/${username}`);
}