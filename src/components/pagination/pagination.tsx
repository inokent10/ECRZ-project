// pagination.tsx - компонент пагинации с логикой "< 1 2 3 4 ... 10 >"
import { JSX } from "react";
import styles from './pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): JSX.Element {
  // Генерация массива номеров страниц для пагинации в формате "< 1 2 3 4 ... 10 >"
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 4; // Максимальное количество видимых страниц (исключая первую и последнюю)
    
    // Всегда показываем первую страницу
    pages.push(1);
    
    if (currentPage > maxVisiblePages - 1) {
      // Если текущая страница достаточно далеко от начала, добавляем троеточие
      pages.push('...');
      
      // Определяем начальную страницу для отображения
      // При currentPage = 4, показываем 4, 5, 6, 7
      const startPage = currentPage;
      const endPage = Math.min(currentPage + maxVisiblePages - 1, totalPages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    } else {
      // Если текущая страница близко к началу, показываем страницы 2, 3, 4, ..
      for (let i = 2; i <= Math.min(maxVisiblePages + 1, totalPages - 1); i++) {
        pages.push(i);
      }
    }
    
    // Если последняя отображаемая страница не последняя в списке, добавляем троеточие
    if (pages[pages.length - 1] !== totalPages - 1 && totalPages > maxVisiblePages + 2) {
      pages.push('...');
    }
    
    // Добавляем последнюю страницу, если всего страниц больше 1
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