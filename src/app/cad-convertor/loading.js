const PAGE_SHELL = {
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(180deg, #f7f5ff 0%, #ffffff 42%)",
};

export default function CadConvertorLoading() {
  return <main style={PAGE_SHELL} aria-busy="true" />;
}
