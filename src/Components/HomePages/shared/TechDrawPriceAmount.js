"use client";

import useTechDrawPriceDisplay from "@/Components/CadDrawingPipeline/useTechDrawPriceDisplay";

/** Live TechDraw / STEP→2D pipeline price from `/v1/cad-techdraw/pricing-info`. */
export default function TechDrawPriceAmount({ as: Component = "strong", className, ...rest }) {
  const { totalLabel } = useTechDrawPriceDisplay();

  if (!totalLabel) return null;

  return (
    <Component className={className} {...rest}>
      {totalLabel}
    </Component>
  );
}
