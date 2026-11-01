"use client";

import React, { createContext, useContext } from "react";

// Server-loaded pricing-info (see getConverterPricingForRender) so converter UI renders real
// prices in the server HTML instead of waiting for the client fetch.
const ConverterPricingSeedContext = createContext(null);

export function ConverterPricingSeedProvider({ pricingInfo, children }) {
  return (
    <ConverterPricingSeedContext.Provider value={pricingInfo || null}>
      {children}
    </ConverterPricingSeedContext.Provider>
  );
}

export function useConverterPricingSeed() {
  return useContext(ConverterPricingSeedContext);
}
