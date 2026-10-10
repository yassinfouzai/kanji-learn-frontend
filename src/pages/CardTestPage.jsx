// src/pages/CardTestPage.jsx
import Card from "../components/Card";

export default function CardTestPage() {
return (
<div
    style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    }}
>
    <Card characters="字" level={3} learned={false} />
    <Card characters="一" level={1} learned={true} />
</div>
);
}