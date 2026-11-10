"use client";

import Link from "next/link";
import styles from "./CadDrawingPipeline.module.css";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";

function buildQuestions(price) {
  const priceSentence = price
    ? `${price} per drawing set.`
    : "One price per drawing set.";

  return [
    {
      question: "How much does a STEP to 2D drawing cost?",
      answer: (
        <p>
          {priceSentence} One set covers one STEP or STP model and includes every view and all four
          file formats: PDF, DXF, SVG and FCStd. There is no subscription.
        </p>
      ),
    },
    {
      question: "How long does it take to generate the drawings?",
      answer: (
        <p>
          Most drawing sets are usually ready in minutes. Very large or complex models can take a
          little longer.
        </p>
      ),
    },
    {
      question: "What is included in a drawing set?",
      answer: (
        <p>
          Front, top and side views in the projection you choose, an isometric view, section views
          through internal features, overall and main feature dimensions, and a title block with
          part name, scale, units and projection. You download it as PDF, DXF, SVG and an
          editable FreeCAD file.
        </p>
      ),
    },
    {
      question: "Can I edit the generated drawings?",
      answer: (
        <p>
          Yes. Open the FCStd file in FreeCAD, which is free, and use the TechDraw workbench to
          move views, add or change dimensions and edit the title block. You can also open the DXF
          in AutoCAD, DraftSight, LibreCAD or other 2D CAD programs.
        </p>
      ),
    },
    {
      question: "Are tolerances and GD&T included?",
      answer: (
        <p>
          No. Automated dimensions describe the geometry, not the design intent behind it. Add
          tolerances, fits, GD&amp;T, thread callouts and surface finish before using a drawing for
          machining or inspection, or order a production drawing from a CAD designer.
        </p>
      ),
    },
    {
      question: "Should I choose first-angle or third-angle projection?",
      answer: (
        <p>
          Choose third angle for drawings going to the United States or Canada, and first angle for
          most of Europe, India and much of Asia. If you&apos;re not sure, ask the person who will
          receive the drawing. The projection you choose is printed in the title block.
        </p>
      ),
    },
    {
      question: "Does it work with STP files?",
      answer: (
        <p>
          Yes. .step and .stp are the same format with two different file extensions, and both are
          accepted.
        </p>
      ),
    },
    {
      question: "Can I convert a STEP file to DXF?",
      answer: (
        <p>
          Yes. Every drawing set includes a DXF of the full sheet, which opens in AutoCAD,
          DraftSight and LibreCAD. It is the drawing sheet at drawing scale, not 1:1 part geometry.
        </p>
      ),
    },
    {
      question: "Can I make a 2D drawing from an STL file?",
      answer: (
        <p>
          Not directly, because drawings need a solid model.{" "}
          <Link href="/tools/convert-stl-to-step">Convert the STL to STEP</Link> first. The drawing
          will show the triangle facets of the mesh as edges, so a rebuilt CAD model gives a much
          cleaner result.
        </p>
      ),
    },
    {
      question: "Can I upload an assembly?",
      answer: (
        <p>
          Yes. The assembly is drawn as one model in its assembled position. For detailed drawings
          of each part, upload each part as its own STEP file.
        </p>
      ),
    },
    {
      question: "What is the maximum file size?",
      answer: <p>You can upload STEP and STP files up to 100 MB.</p>,
    },
    {
      question: "Do I need CAD software?",
      answer: (
        <p>
          No. Everything runs in your web browser on Windows, macOS, Linux, iPad and Android. You
          only need FreeCAD or a 2D CAD program if you want to edit the drawing afterwards.
        </p>
      ),
    },
    {
      question: "Are my files private?",
      answer: (
        <p>
          Files are transferred over an encrypted connection and are never added to the public Marathon
          OS CAD library. Rendered views of your part are sent to our AI provider to plan the drawing.
          Download access ends after 7 days. You keep full ownership of
          your design.
        </p>
      ),
    },
  ];
}

export default function CadDrawingPipelineQuestions({ initialPrices }) {
  const { totalLabel } = useTechDrawPriceDisplay(initialPrices);
  const questions = buildQuestions(totalLabel || "");

  return (
    <section className={styles.faqBand} id="drawing-faq" aria-labelledby="cad-pipeline-questions-title">
      <div className={styles.faqLayout}>
        <div className={styles.faqSticky}>
          <p className={styles.pricingEyebrow}>FAQ</p>
          <h2 id="cad-pipeline-questions-title" className={styles.faqTitle}>
            STEP to 2D drawing questions
          </h2>
          <p className={styles.faqLede}>
            Answers about price, formats, standards, editing and privacy.
          </p>
        </div>

        <div className={styles.faqList}>
          {questions.map((item) => (
            <details
              key={item.question}
              id={item.question.startsWith("What is included") ? "whats-included" : undefined}
              className={styles.faqItem}
              open
            >
              <summary className={styles.faqSummary}>{item.question}</summary>
              <div className={styles.faqAnswer}>{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
