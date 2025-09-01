"use client";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React from 'react'
import styles from './CommonStyles.module.css';

function Pagenation({currentPage,setCurrentPage,totalPages}) {
     const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) { 
            setCurrentPage(newPage);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
      <div className={styles.paginationWrapper}>
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.prevButton}
          >
            <KeyboardBackspaceIcon />
            prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.active : ''}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.nextButton}
          >
            next
            <KeyboardBackspaceIcon style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>
    )
}

export default Pagenation