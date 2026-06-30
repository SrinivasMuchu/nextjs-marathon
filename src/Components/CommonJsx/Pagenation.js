"use client";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React from 'react'
import styles from './CommonStyles.module.css';

function Pagenation({ currentPage, setCurrentPage, onPageChange, totalPages, noPages }) {
  const changePage = onPageChange || setCurrentPage

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      changePage?.(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      changePage?.(currentPage + 1);
    }
  };

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pagination}>

        {/* Prev Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.prevButton}
        >
          <KeyboardBackspaceIcon />
          prev
        </button>

        {/* Page Numbers (only if noPages is false) */}
        {!noPages && (
          Array.from({ length: totalPages }, (_, index) => (
            <button
              type="button"
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`${styles.paginationButton} ${
                currentPage === index + 1 ? styles.active : ''
              }`}
            >
              {index + 1}
            </button>
          ))
        )}

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.nextButton}
        >
          next
          <KeyboardBackspaceIcon style={{ transform: 'rotate(180deg)' }} />
        </button>

      </div>
    </div>
  );
}

export default Pagenation;
