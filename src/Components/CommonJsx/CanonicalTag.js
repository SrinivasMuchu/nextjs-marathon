"use client"; 

import { usePathname } from "next/navigation";
import Head from "next/head";

const CanonicalTag = () => {
  const pathname = usePathname();
  const canonicalUrl = `https://marathon-os.com${pathname}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default CanonicalTag;
