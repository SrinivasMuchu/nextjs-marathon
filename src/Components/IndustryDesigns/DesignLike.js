"use client"
import React, { useContext } from 'react'
import { contextState } from '../CommonJsx/ContextProvider';
import { PiHandsClapping } from "react-icons/pi";
import axios from "axios";
import { BASE_URL } from "../../config"; // Adjust the import if needed

function DesignLike({ designId }) {
    const { setIsLiked, isLiked, designLiked } = useContext(contextState);

    // Only render if designLiked is true
    if (!designLiked) return null;

    // Skin color (light yellowish)
    const skinColor = "#FFCA28";
    const whiteColor = "#000000";

    const handleClick = async () => {
        try {
            setIsLiked(!isLiked);
            // setDownloadedFileUpdate(prev => prev + 1);

            await axios.post(`${BASE_URL}/v1/cad/get-signedurl`, {
                action_type: 'LIKE',
                is_liked: !isLiked,
                design_id: designId
            }, {
                headers: { 'user-uuid': localStorage.getItem('uuid') }
            });
        } catch (error) {
            console.error("Error liking design:", error);
        }
    };

    return (
        <div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={handleClick}>
            <PiHandsClapping
                size={48}
                color={isLiked ? skinColor : whiteColor}
                style={{
                    borderRadius: "50%",
                    background: "#f5f5f5", // Keep the background neutral
                    padding: 8,
                    // boxShadow: isLiked ? "0 0 8px #FFD19C" : "none",
                    transition: "color 0.2s"
                }}
            />
        </div>
    )
}

export default DesignLike