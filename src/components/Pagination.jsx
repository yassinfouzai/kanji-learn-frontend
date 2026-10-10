// src/components/Pagination.jsx

const SIZE = 50;

const boldText = { fontWeight: 800 };

const numberButton = {
    ...boldText,
    width: SIZE,
    height: SIZE,
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
};

const activeNumberButton = {
    ...numberButton,
    backgroundColor: "#F4C8AF",
};

function getPageItems(current, total) {
    if (!total) {
        return [...new Set([1, current - 1, current].filter((n) => n >= 1))]
            .sort((a, b) => a - b)
            .flatMap((n, i, arr) => (i > 0 && n - arr[i - 1] > 1 ? ["…", n] : [n]));
    }

    const pages = [...new Set([1, current, total])]
        .filter((n) => n >= 1 && n <= total)
        .sort((a, b) => a - b);

    const items = [];
    pages.forEach((n, i) => {
        if (i > 0) {
            const gap = n - pages[i - 1];
            if (gap === 2) items.push(n - 1);
            else if (gap > 2) items.push("…");
        }
        items.push(n);
    });
    return items;
}

export default function Pagination({ page, totalPages, loading, onChange }) {
    const current = page + 1;
    const items = getPageItems(current, totalPages);

    return (
        <div className="pager-controls" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
                className="pager-button"
                onClick={() => onChange(page - 1)}
                disabled={loading || page <= 0}
                style={{ ...boldText, height: SIZE }}
            >
                &lt; Prev
            </button>

            {items.map((item, i) =>
                item === "…" ? (
                    <span key={`gap-${i}`} style={{ ...boldText, padding: "0 4px" }}>…</span>
                ) : (
                    <button
                        key={item}
                        className="pager-button"
                        onClick={() => onChange(item - 1)}
                        disabled={loading || item === current}
                        style={item === current ? activeNumberButton : numberButton}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                className="pager-button"
                onClick={() => onChange(page + 1)}
                disabled={loading || (totalPages !== null && current >= totalPages)}
                style={{ ...boldText, height: SIZE }}
            >
                Next &gt;
            </button>
        </div>
    );
}