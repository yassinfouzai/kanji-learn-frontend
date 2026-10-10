// src/api/kanji.js
import { apiRequest } from "./client";

export function getKanjiByCharacter(characters) {
    return apiRequest(`/kanji/${characters}`);    
}

export function getKanjiPage({ page = 0, size = 45, sort = "level,asc" } = {}) {
    const query = `?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}&sort=${encodeURIComponent(sort)}`;
    return apiRequest(`/kanji${query}`);
}