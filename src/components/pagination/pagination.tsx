// pagination.tsx - компонент пагинации с логикой "< 1 2 3 4 ... 10 >"
import { JSX } from "react";
import styles from './pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): JSX.Element {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 4; 
    
    pages.push(1);
    
    if (currentPage > maxVisiblePages - 1) {
      pages.push('...');
      
      const startPage = currentPage;
      const endPage = Math.min(currentPage + maxVisiblePages - 1, totalPages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 2; i <= Math.min(maxVisiblePages + 1, totalPages - 1); i++) {
        pages.push(i);
      }
    }
    
    if (pages[pages.length - 1] !== totalPages - 1 && totalPages > maxVisiblePages + 2) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button 
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        &lt;
      </button>
      
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button 
            key={`page-${page}`}
            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Страница ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
        )
      ))}
      
      <button 
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;