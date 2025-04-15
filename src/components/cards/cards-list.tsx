// CardsList.tsx - компонент с пагинацией на основе данных с сервера
import { useState, useEffect, JSX } from "react";
import { ApiResponse, CardsEntity } from "@/types/cards-types/cards-types";
import styles from './cards.module.scss';
import Card from "./card";
import Pagination from "../pagination/pagination";

type CardsListProps = {
  cards: ApiResponse<CardsEntity>;
  onPageChange?: (page: number) => void; // Функция для запроса новой страницы с сервера
}

function CardsList({ cards, onPageChange }: CardsListProps): JSX.Element {
  // Состояние для хранения текущих карточек
  const [currentItems, setCurrentItems] = useState<CardsEntity[]>(cards.entities || []);
  const [currentPage, setCurrentPage] = useState(cards.currentPage || 1);
  const [totalPages, setTotalPages] = useState(cards.totalPages || 1);

  // Обновляем состояние, когда меняются props
  useEffect(() => {
    setCurrentItems(cards.entities || []);
    setCurrentPage(cards.currentPage || 1);
    setTotalPages(cards.totalPages || 1);
  }, [cards]);

  // Обработчик изменения страницы
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    if (onPageChange) {
      // Если передана функция обратного вызова, вызываем её для загрузки новой страницы
      onPageChange(pageNumber);
    } else {
      setCurrentPage(pageNumber);
    }
    
    // Прокрутка вверх при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.cardsWrapper}>
        {currentItems.map((card) => (
          <Card card={card} key={card.id} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
}

export default CardsList;