// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../api/progress";
import { apiRequest } from "../api/client";
import Pagination from "../components/Pagination";
import SortSelect from "../components/SortSelect";
import ProgressStats from "../components/ProgressStats";

export default function DashboardPage() {
    const auth = useAuth();
    const profile = auth?.profile;
    const token = auth?.token;
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page") ?? 0);
    const initialSize = Number(searchParams.get("size") ?? 45);
    const initialSort = (searchParams.getAll("sort")[0]) || searchParams.get("sort") || "kanji.level,asc";

    const [page, setPage] = useState(initialPage);
    const [size] = useState(initialSize);
    const [sort, setSort] = useState(initialSort);
    const [totalPages, setTotalPages] = useState(null);
    const [stats, setStats] = useState(null);

    const SORT_OPTIONS = [
        { value: "kanji.level,asc", label: "Level ↑" },
        { value: "kanji.level,desc", label: "Level ↓" },
        { value: "kanji.characters,asc", label: "Character ↑" },
        { value: "kanji.characters,desc", label: "Character ↓" },
    ];

    const toolbar = {
        border: "5px solid #272727",
        borderRadius: 8,
        padding: 8,
        margin: "8px 0",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
    };

    useEffect(() => {
        if (!token || !profile?.username) {
            setLoading(false);
            setError(null);
            return;
        }

        async function loadDashboard() {
        setLoading(true);
        setError(null);
        try {
            // build sort array and only add tie-breaker if not already present
            const sortsToSend = Array.isArray(sort) ? [...sort] : [sort];
            if (!sortsToSend.some(s => /kanji\.id/.test(s) || /\bid\b/.test(s))) {
                sortsToSend.push("kanji.id,asc");
            }
            const response = await getDashboard(profile.username, { page, size, sort: sortsToSend });
            const respData = response && response.data;


            let itemsData = [];
            if (!respData) {
                itemsData = [];
            } else if (Array.isArray(respData)) {
                itemsData = respData;
            } else if (Array.isArray(respData.data)) {
                itemsData = respData.data;
            } else if (Array.isArray(respData.content)) {
                itemsData = respData.content;
            } else {
                itemsData = respData.items || respData.results || [];
            }

            const tp = respData && (respData.totalPages || respData.total_pages || (respData.page && respData.page.totalPages) || (respData.meta && respData.meta.totalPages));
            const pn = respData && (respData.number ?? respData.page ?? respData.pageNumber ?? (respData.page && respData.page.number) ?? page);
            setItems(itemsData);
            setTotalPages(tp !== undefined ? Number(tp) : null);
            setPage(pn !== undefined ? Number(pn) : page);
            // fetch stats (separately) and set
            try {
                const statsResp = await apiRequest(`/progress/${profile.username}/stats`);
                setStats(statsResp && statsResp.data ? statsResp.data : statsResp);
            } catch (sErr) {
                console.warn("Failed to load stats", sErr);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }
        loadDashboard();
    }, [profile?.username, page, size, sort, token]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        params.set("size", String(size));
        const urlSorts = Array.isArray(sort) ? [...sort] : [sort];
        if (!urlSorts.some(s => /kanji\.id/.test(s) || /\bid\b/.test(s))) urlSorts.push("kanji.id,asc");
        params.delete("sort");
        for (const s of urlSorts) params.append("sort", s);
        setSearchParams(params, { replace: true });
    }, [page, size, sort, setSearchParams]);

    if (loading) return <div>Loading kanji...</div>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
        <h1>
            <Link to={`/u/${profile.username}`}>{profile.username}</Link>'s Kanji Dashboard
        </h1>

        {stats && <ProgressStats stats={stats} />}

        <div style={toolbar}>
            <Pagination page={page} totalPages={totalPages} loading={loading} onChange={setPage} />

            <SortSelect
                value={sort}
                options={SORT_OPTIONS}
                onChange={(newSort) => {
                    setSort(newSort);
                    setPage(0);
                }}
            />
        </div>

        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "25px",
            alignItems: "start",
            }}
        >
            {items.map((item) => (
            <Link
                key={item.kanjiId || item.id || item.characters}
                to={`/kanji/${item.characters}`}
                className="kanji-tile"
                style={{ backgroundColor: item.learned ? "#CEF6DF" : "#FFF", textDecoration: "none" }}
            >
                {item.characters}
            </Link>
            ))}
        </div>
        </div>
    );
}