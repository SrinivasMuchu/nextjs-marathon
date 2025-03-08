import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

function CloseButton({ styles, handleClose,heading }) {
    return (
        <div className={styles["cancel"]}>
            <span>{heading}</span>
            <CloseIcon onClick={handleClose} />
        </div>
    )
}

export default CloseButton