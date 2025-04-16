import { useState, useEffect, JSX } from "react";
import { ApiResponse, CardsEntity } from "@/types/cards-types/cards-types";
import styles from './cards.module.scss';
import Card from "./card";
import Pagination from "../pagination/pagination";

type CardsListProps = {
  cards: ApiResponse<CardsEntity>;
  onPageChange?: (page: number) => void; 
}

function CardsList({ cards, onPageChange }: CardsListProps): JSX.Element {
  const [currentItems, setCurrentItems] = useState<CardsEntity[]>(cards.entities || []);
  const [currentPage, setCurrentPage] = useState(cards.currentPage || 1);
  const [totalPages, setTotalPages] = useState(cards.totalPages || 1);

  useEffect(() => {
    setCurrentItems(cards.entities || []);
    setCurrentPage(cards.currentPage || 1);
    setTotalPages(cards.totalPages || 1);
  }, [cards]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    if (onPageChange) {
      onPageChange(pageNumber);
    } else {
      setCurrentPage(pageNumber);
    }
    
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