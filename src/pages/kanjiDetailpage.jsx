// src/pages/KanjiDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getKanjiByCharacter } from "../api/kanji";
import { getProgressForKanji, toggleLearned } from "../api/progress";

/* ---------- styles ---------- */
const BORDER = "4px solid #272727";
const SECTION_BORDER = "3px solid #272727";

const styles = {
    container: {
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 15,
    },
    backLink: { textDecoration: "none", width: "fit-content" },
    backButton: { backgroundColor: "#BBDFDB" },
    card: {
        border: "5px solid #272727",
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#F8F7F3",
        color: "#272727",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 20,
        alignItems: "stretch", // both columns share the same height
    },

    /* left panel */
    leftPanel: {
        border: BORDER,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // content stays on top, empty space goes below
        gap: 12,
        padding: 12,
    },
    level: { 
        margin: 0,
        color: "#333",
        border: "4px solid #272727",
        borderRadius: 8,
        width: "100%",
        maxWidth: 220,
        backgroundColor: "#EFF9DA",
    },
    kanjiBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "6rem",
        width: "100%",
        maxWidth: 220,
        aspectRatio: "1 / 1",
        border: "4px dashed #272727",
        borderRadius: 8,
        backgroundColor: "#F1EBDD",
    },

    /* right panel */
    rightPanel: {
        border: BORDER,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    sectionTitle: {
        margin: 0,
        padding: 16,
        borderBottom: SECTION_BORDER,
        backgroundColor: "#CDF5F6",
    },
    list: { listStyle: "none", margin: 0, padding: "8px 16px" },
};

/* ---------- small components ---------- */
function InfoSection({ title, items, renderItem, withDivider }) {
    return (
        <section style={withDivider ? { borderTop: SECTION_BORDER } : undefined}>
            <h3 style={styles.sectionTitle}>{title}</h3>
            <ul style={styles.list}>
                {items.map((item) => (
                    <li key={item.id}>{renderItem(item)}</li>
                ))}
            </ul>
        </section>
    );
}

function KanjiSidePanel({ kanji, learned, toggling, onToggle }) {
    return (
        <div style={styles.leftPanel}>
            <p style={styles.level}>Level {kanji.level}</p>
            <div style={styles.kanjiBox}>{kanji.characters}</div>
            <button onClick={onToggle} disabled={toggling} className="pager-button">
                {learned ? "Mark as Unlearned" : "Mark as Learned"}
            </button>
        </div>
    );
}

/* ---------- page ---------- */
export default function KanjiDetailPage() {
    const { characters } = useParams();
    const { token } = useAuth();

    const [kanji, setKanji] = useState(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        if (!token) {
            setKanji(null);
            setProgress(null);
            setError(null);
            setLoading(false);
            return;
        }

        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                const kanjiResponse = await getKanjiByCharacter(characters);
                setKanji(kanjiResponse.data);

                const progressResponse = await getProgressForKanji(kanjiResponse.data.id, token);
                setProgress(progressResponse.data);
            } catch (err) {
                if (err.message === "Session expired. Please log in again.") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("profile");
                }
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [characters, token]);

    async function handleToggle() {
        setToggling(true);
        try {
            const response = await toggleLearned(kanji.id, token);
            setProgress(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setToggling(false);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!kanji) return null;

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>
                <div style={styles.backButton} className="pager-button">
                    &larr; Back to dashboard
                </div>
            </Link>

            <div style={styles.card}>
                <div style={styles.grid}>
                    <KanjiSidePanel
                        kanji={kanji}
                        learned={progress?.learned}
                        toggling={toggling}
                        onToggle={handleToggle}
                    />

                    <div style={styles.rightPanel}>
                        <InfoSection
                            title="Meanings"
                            items={kanji.meanings || []}
                            renderItem={(m) => (
                                <>{m.meaning} {m.primaryMeaning && "(primary)"}</>
                            )}
                        />
                        <InfoSection
                            title="Readings"
                            withDivider
                            items={kanji.readings || []}
                            renderItem={(r) => (
                                <>{r.reading} — {r.type} {r.primaryReading && "(primary)"}</>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}