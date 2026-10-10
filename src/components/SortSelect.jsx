// src/components/SortSelect.jsx
const SIZE = 50;

const arrow = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#272727" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
);

const styles = {
    label: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 800,
    },
    select: {
        height: SIZE,
        padding: "0 36px 0 12px",
        fontWeight: 800,
        fontSize: "1rem",
        fontFamily: "inherit",
        color: "#272727",
        backgroundColor: "#CBE4F9",
        border: "4px solid #272727",
        borderRadius: 8,
        cursor: "pointer",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,${arrow}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
    },
};

export default function SortSelect({ value, options, onChange, label = "Sort:" }) {
    return (
        <label style={styles.label}>
            {label}
            <select
                style={styles.select}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}