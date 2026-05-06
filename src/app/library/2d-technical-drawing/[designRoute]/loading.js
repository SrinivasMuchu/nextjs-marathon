export default function LoadingTwoDTechnicalDrawingPage() {
  return (
    <div
      style={{
        padding: "24px 0",
        display: "grid",
        gap: "12px",
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        style={{
          height: 18,
          width: "42%",
          borderRadius: 8,
          background: "#eef2f7",
        }}
      />
      <div
        style={{
          height: 360,
          width: "100%",
          borderRadius: 12,
          background: "#eef2f7",
        }}
      />
      <div
        style={{
          height: 120,
          width: "100%",
          borderRadius: 12,
          background: "#eef2f7",
        }}
      />
    </div>
  );
}

