"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './CadHome.module.css'

function FormateSelector() {
    const [selectedFormat, setSelectedFormat] = useState(""); // State to store selected format
    const router = useRouter();
    const formats = [
        { label: "STEP", extensions: [".step", ".stp"] },
        { label: "IGES", extensions: [".igs", ".iges"] },
        { label: "STL", extensions: [".stl"] },
        { label: "PLY", extensions: [".ply"] },
        { label: "OFF", extensions: [".off"] },
        { label: "BREP", extensions: [".brp", ".brep"] },
        { label: "OBJ", extensions: [".obj"] },
        { label: "DWG", extensions: [".dwg"] },
        { label: "DXF", extensions: [".dxf"] },
        
        //  { label: "GLB", extensions: [".glb"] },
    ];
    const handleFormatChange = (event) => {
        const format = event.target.value;
        setSelectedFormat(format);

        // Navigate dynamically to /tools/[cad_file]
        if (format) {
            router.push(`/tools/${format}/file-viewer`);
        }
    };
    return (
        <div className={styles["cad-dropdown-container"]}>
            <label htmlFor="cad-format" className={styles["cad-dropdown-label"]}>
                Select Format:
            </label>
            <select
                id="cad-format"
                className={styles["cad-dropdown"]}
                value={selectedFormat}
                onChange={handleFormatChange}
            >
                <option value="" disabled>
                    Choose a format
                </option>
                {formats.map((format) => (
                    <option key={format.label} value={format.label.toLowerCase()}>
                        {format.label} ({format.extensions.join(", ")})
                    </option>
                ))}
            </select>
        </div>
    )
}

export default FormateSelector