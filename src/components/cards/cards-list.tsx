import { useState, useEffect, JSX } from "react";
import { ApiResponse, CardsEntity } from "@/types/cards-types/cards-types";
import styles from './cards.module.scss';
import Card from "./card";
import Pagination from "../pagination/pagination";

type CardsListProps = {
  cards: ApiResponse<CardsEntity>;
  currentPage: number;
  onPageChange: (page: number) => void; 
}

function CardsList({ cards, onPageChange, currentPage }: CardsListProps): JSX.Element {
  const [currentItems, setCurrentItems] = useState<CardsEntity[]>(cards.entities || []);
  
  useEffect(() => {
    setCurrentItems(cards?.entities || []);
  }, [cards, onPageChange]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > cards.totalPages) return;
    
    if (onPageChange) {
      onPageChange(pageNumber);
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
      
      {cards.totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={cards.totalPages}
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
}

export default CardsList;