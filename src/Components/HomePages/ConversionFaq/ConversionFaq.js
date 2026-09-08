"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useConverterPriceDisplay from "../shared/useConverterPriceDisplay";
import useTechDrawPriceDisplay from "@/Components/CadDrawingPipeline/useTechDrawPriceDisplay";
import styles from "./ConversionFaq.module.css";

function ConversionFaq() {
  const { priceLabel: converterLabel } = useConverterPriceDisplay("$2.99");
  const { totalLabel: drawingLabel } = useTechDrawPriceDisplay();
  const formatPrice = converterLabel || "$2.99";
  const drawPrice = drawingLabel || "$5.99";

  const faqItems = [
    {
      question: "What are the two types of CAD conversion on Marathon OS?",
      answer:
        "Marathon OS handles format-to-format conversion, such as STEP to STL, and 3D CAD to 2D drawing conversion, such as STEP or STP to a multi-view PDF, SVG or DXF drawing set.",
    },
    {
      question: "Which CAD file formats can I convert?",
      answer:
        "Marathon OS supports STEP, STP, IGES, STL, OBJ, PLY, OFF, BREP, 3DM, DWG and DXF across more than 60 specialist conversion tools.",
    },
    {
      question: "How much does a standard CAD format conversion cost?",
      answer: `A single standard conversion download costs ${formatPrice}. Credit packs reduce the per-download price further. One credit downloads one converted file of any supported size, and credits never expire.`,
    },
    {
      question: "How much does STEP or STP to 2D conversion cost?",
      answer: `A STEP or STP to 2D drawing conversion costs ${drawPrice}. The result can include multi-view technical drawing sheets in PDF, SVG and DXF formats, depending on the selected output.`,
    },
    {
      question: "Will a converted file keep every original CAD feature?",
      answer:
        "Not always. CAD-to-mesh conversion can remove parametric features, while mesh-to-CAD conversion may create reconstructed surfaces or approximations. Marathon OS shows these quality notes so you can choose the route with the right expectations.",
    },
    {
      question: "How are uploaded engineering files handled?",
      answer:
        "Files are encrypted during upload, processed privately and automatically deleted after 7 days. Uploaded conversion files are not added to the public CAD library.",
    },
    {
      question: "When should I hire a CAD designer instead of using a converter?",
      answer:
        "Use a converter when the geometry is correct and only the format or drawing output needs to change. Hire a CAD designer when geometry is missing, damaged, needs new tolerances, requires a native parametric rebuild or must be redesigned for manufacturing.",
    },
  ];

  return (
    <section className={styles.section} id="faqs" aria-labelledby="conversion-faq-heading">
      <div className={styles.shell}>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className={styles.label}>CAD CONVERSION FAQS</p>
            <h2 id="conversion-faq-heading" className={styles.title}>
              Everything to know before you convert.
            </h2>
            <p className={styles.description}>
              Clear answers on conversion types, pricing, formats, output quality and private file
              handling.
            </p>
            <Link className={styles.link} href="/tools/3d-cad-file-converter">
              Open the CAD converter
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.list}>
            {faqItems.map(({ question, answer }) => (
              <article key={question} className={styles.item}>
                <h3 className={styles.question}>{question}</h3>
                <p className={styles.answer}>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConversionFaq;
