// src/api/progress.js
import { apiRequest } from "./client";

export function getDashboard(username, { page = 0, size = 45, sort = "kanji.level,asc" } = {}) {
    let query = "";
    const params = [];
    if (page !== undefined) params.push(`page=${encodeURIComponent(page)}`);
    if (size !== undefined) params.push(`size=${encodeURIComponent(size)}`);
        if (sort !== undefined) {
            if (Array.isArray(sort)) {
                for (const s of sort) {
                    params.push(`sort=${encodeURIComponent(s)}`);
                }
            } else {
                params.push(`sort=${encodeURIComponent(sort)}`);
            }
        }
    if (params.length) query = `?${params.join("&")}`;
    return apiRequest(`/progress/${username}/dashboard${query}`);
}

export function getProgressForKanji(kanjiId, token) {
    return apiRequest(`/progress/me/kanji/${kanjiId}`, { token });
    }

    export function toggleLearned(kanjiId, token) {
    return apiRequest(`/progress/kanji/${kanjiId}/toggle`, { method: "PATCH", token });
}