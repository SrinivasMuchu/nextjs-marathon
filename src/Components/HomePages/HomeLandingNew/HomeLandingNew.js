import { cookies } from "next/headers";
import { fetchTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import { BASE_URL } from "@/config";
import HomeHero from "./HomeHero";

async function loadConverterPricing(uuid) {
  if (!uuid || !BASE_URL) return null;
  try {
    const res = await fetch(`${BASE_URL}/v1/cad/converter/pricing-info`, {
      headers: { Accept: "application/json", "user-uuid": uuid },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.meta?.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function HomeLandingNew() {
  const drawingPrices = await fetchTechDrawPriceDisplay();
  const uuid = cookies().get("uuid")?.value || "";
  const converterInfo = await loadConverterPricing(uuid);
  return <HomeHero initialDrawingPrices={drawingPrices} initialConverterInfo={converterInfo} />;
}
