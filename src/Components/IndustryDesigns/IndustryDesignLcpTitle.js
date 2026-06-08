const titleStyle = {
  color: '#000',
  fontSize: 'clamp(22px, 5vw, 32px)',
  fontWeight: 700,
  lineHeight: 1.25,
  margin: 0,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const wrapperStyle = {
  width: '100%',
  padding: '0 10px',
  boxSizing: 'border-box',
};

export default function IndustryDesignLcpTitle({ title }) {
  if (!title) return null;

  return (
    <div style={wrapperStyle}>
      <h1 style={titleStyle}>{title}</h1>
    </div>
  );
}
