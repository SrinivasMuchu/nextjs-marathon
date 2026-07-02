import Link from "next/link";
import cadStyles from "../CadUploadingHome/CadHomeDesign/CadHome.module.css";

export default function TwoDSourceCadModelBlock({ cadModelHref }) {
  if (!cadModelHref) return null;

  return (
    <div className={cadStyles["industry-design"]} style={{ backgroundColor: "white" }}>
      <div className={cadStyles["cad-landing-left-cont"]}>
        <div className={cadStyles["cad-landing-left-content"]}>
          <h2 className={cadStyles["cad-landing-heading"]}>Preview the Source 3D CAD Model</h2>
          <p className={cadStyles["cad-landing-description"]}>
            Open the original 3D CAD model used to generate this 2D drawing set. Review the
            source geometry before downloading or using the technical drawings.
          </p>
          <Link
            href={cadModelHref}
            className={cadStyles["cad-conversion-button"]}
            style={{ display: "inline-block", marginTop: 16, textDecoration: "none", color: "white" }}
          >
            Open 3D CAD model →
          </Link>
        </div>
      </div>
    </div>
  );
}
