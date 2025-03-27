"use client";
import { useContext,useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { contextState } from "@/Components/CommonJsx/ContextProvider";



function CadDynamicHeaderWrapper({children}) {
      const { setParamsText,paramsText} = useContext(contextState);
    const pathname = usePathname();
  
    // Debugging: Log the full pathname
    useEffect(() => {
        console.log("Full Pathname:", pathname);
    
        // Split path and get all segments
        const pathSegments = pathname.split("/").filter(Boolean);
        console.log("Path Segments:", pathSegments);
    
        // Get the last segment dynamically
        const formatsSegment = pathSegments.at(-1) ?? "";
        console.log("Raw formatsSegment:", formatsSegment);
    
        // Extract 'from' and 'to' dynamically
        let from = "dwg", to = "stl";
        if (formatsSegment) {
          const extracted = formatsSegment.split(/-to-|_to_|_/i);
          console.log("Extracted Parts:", extracted);
          
          if (extracted.length === 2) {
            [from, to] = extracted;
          }
        }
    
        // Remove file extensions if present
        from = from.replace(/\.\w+$/, "");
        to = to.replace(/\.\w+$/, "");
    
        // Only update state if values have changed (prevent unnecessary renders)
        if (paramsText.from !== from || paramsText.to !== to) {
        
          setParamsText({ from, to });
        }
    
        console.log("Final Extracted:", { from, to });
    
      }, [pathname]); // Runs only when pathname changes
  return (
    <>{children}</>
  )
}

export default CadDynamicHeaderWrapper