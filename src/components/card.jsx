// src/components/Card.jsx
import { useNavigate } from "react-router-dom";
import texture from "../assets/texture4.svg";

function getLevelColor(level) {
  if (level <= 10) return "#a5e250";   // blue
  if (level <= 20) return "#9b59b6";   // purple
  if (level <= 30) return "#e67e22";   // orange
  if (level <= 40) return "#e74c3c";   // red
  if (level <= 50) return "#1abc9c";   // teal
  return "#f39c12";                     // gold (51-60)
}

export default function Card({ characters, level, learned }) {
const navigate = useNavigate();
const overlayColor = learned ? "#948edc" : getLevelColor(level);
const borderColor = "#a5e250";

return (
<div
    onClick={() => navigate(`/kanji/${characters}`)}
    style={{
        width: "120px",
        height: "180px",
        borderRadius: "12px",
        border: "4px solid " + borderColor,
        backgroundImage: `url(${texture})`,
        backgroundSize: "250%",
        backgroundPosition: "center",
        position: "relative",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        userSelect: "none",
        overflow: "hidden",
        clipPath: "path('M 0 8 Q 0 0 8 0 L 112 0 Q 120 0 120 8 L 120 148 Q 120 156 112 156 L 24 156 Q 20 156 20 160 L 20 172 Q 20 180 12 180 L 8 180 Q 0 180 0 172 Z')"
    }}
>
    {/* Color overlay */}
    <div
    style={{
        position: "absolute",
        inset: 0,
        backgroundColor: overlayColor,
        opacity: 0.8,
        mixBlendMode: "screen",
        borderRadius: "0px",
        zIndex: 0,
    }}
    />

    {/* Top-left: learned indicator */}
    <div
    style={{
        position: "absolute",
        top: "5px",
        left: "5px",
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: "2px solid rgba(255,255,255,0.8)",
        backgroundColor: learned
        ? "rgba(100, 200, 100, 0.85)"
        : "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    }}
    >
    {learned && (
        <span style={{ color: "white", fontSize: "13px", lineHeight: 1 }}>
        ✓
        </span>
    )}
    </div>

        <div
    style={{
        position: "absolute",
        bottom: "5px",
        right: "5px",
        width: "40px",
        height: "20px",
        borderRadius: "4px",
        border: "2px solid rgba(255,255,255,0.8)",
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    }}
    >
    <span
        style={{
        fontSize: "0.65rem",
        color: "rgba(255,255,255,0.75)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        }}
    >
        Lvl: {level}
    </span>
    </div>

    {/* Center: kanji + level */}
    <div
    style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80px",
        height: "80px",
        borderRadius: "12px",
        border: "2px solid rgba(255,255,255,0.9)",
        boxShadow: "0 0 10px rgba(255,255,255,0.15)",
        backgroundColor: "rgba(0,0,0,1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        zIndex: 1,
    }}
    >
    <span style={{ fontSize: "2rem", color: "white", lineHeight: 1, color : borderColor }}>
        {characters}
    </span>
    </div>
</div>
);
}