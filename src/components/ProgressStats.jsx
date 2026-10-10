// src/components/ProgressStats.jsx
const BORDER_COLOR = "#272727";

const styles = {
    card: {
        marginTop: 12,
        border: `5px solid ${BORDER_COLOR}`,
        borderRadius: 10,
        backgroundColor: "#FFF",
        color: BORDER_COLOR,
        overflow: "hidden",
    },
    header: {
        padding: "10px 16px",
        borderBottom: `5px solid ${BORDER_COLOR}`,
        backgroundColor: "#CDF5F6",
        fontWeight: 800,
        fontSize: "1.1rem",
    },
    body: {
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    tiles: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
    },
    tile: {
        border: `3px solid ${BORDER_COLOR}`,
        borderRadius: 8,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    tileValue: { fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.1 },
    tileLabel: { fontSize: "0.85rem", fontWeight: 600, opacity: 0.8 },
    barTrack: {
        height: 28,
        border: `4px solid ${BORDER_COLOR}`,
        borderRadius: 8,
        backgroundColor: "#F1EBDD",
        overflow: "hidden",
    },
    barLabelRow: {
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 800,
        marginBottom: 6,
    },
};

function StatTile({ label, value, color }) {
    return (
        <div style={{ ...styles.tile, backgroundColor: color }}>
            <span style={styles.tileValue}>{value}</span>
            <span style={styles.tileLabel}>{label}</span>
        </div>
    );
}

export default function ProgressStats({ stats }) {
    const total = stats.totalKanji ?? stats.total ?? 0;
    const learned = stats.learnedKanji ?? stats.learned ?? 0;
    const recent = stats.learnedInLast7Days ?? stats.recentlyLearned ?? 0;

    // use the server's percentage if it's usable, otherwise compute it
    const parsed = Number.parseFloat(stats.completionPercentage);
    const rawPercent = Number.isFinite(parsed) ? parsed : total ? (learned / total) * 100 : 0;
    const percent = Math.min(100, Math.max(0, Math.round(rawPercent * 100) / 100));

    return (
        <div style={styles.card}>
            <div style={styles.header}>Progress</div>

            <div style={styles.body}>
                <div style={styles.tiles}>
                    <StatTile label="Total kanji" value={total.toLocaleString()} color="#EFF9DA" />
                    <StatTile label="Learned" value={learned.toLocaleString()} color="#BBDFDB" />
                    <StatTile label="Last 7 days" value={recent.toLocaleString()} color="#D6CDEA" />
                </div>

                <div>
                    <div style={styles.barLabelRow}>
                        <span>Completion</span>
                        <span>{percent}%</span>
                    </div>
                    <div
                        style={styles.barTrack}
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percent}
                    >
                        <div
                            style={{
                                width: `${percent}%`,
                                height: "100%",
                                backgroundColor: "#BBDFDB",
                                borderRight: percent > 0 && percent < 100 ? `4px solid ${BORDER_COLOR}` : "none",
                                transition: "width 0.4s ease",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}