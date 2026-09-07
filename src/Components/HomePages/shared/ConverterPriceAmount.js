"use client";

import useConverterPriceDisplay from "./useConverterPriceDisplay";

/** Live converter single-download price from `/v1/cad/converter/pricing-info`. */
export default function ConverterPriceAmount({ as: Component = "strong", className, ...rest }) {
  const { priceLabel } = useConverterPriceDisplay();

  if (!priceLabel) return null;

  return (
    <Component className={className} {...rest}>
      {priceLabel}
    </Component>
  );
}
