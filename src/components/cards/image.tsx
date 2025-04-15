import { JSX, useState } from "react";
import styles from './cards.module.scss';
import { Media } from "@/types/cards-types/cards-types";

type ImageProps = {
    name: string;
    media: Media[];
}

function ImageCard({ name, media }: ImageProps): JSX.Element {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const imageUrl = media.length > 0 
    ? media[currentImageIndex]?.url || '/placeholder-image.jpg'
        : '/placeholder-image.jpg';
    
    const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? media.length - 1 : prev - 1
    );
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === media.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };
    
    return (
        <div className={styles.imageContainer}>
        <div className={styles.imageNav}>
          <button 
            className={`${styles.navButton} ${styles.prevButton}`} 
            onClick={goToPrevImage}
            aria-label="Previous image"
          >
            <span>‹</span>
          </button>
          <button 
            className={`${styles.navButton} ${styles.nextButton}`} 
            onClick={goToNextImage}
            aria-label="Next image"
          >
            <span>›</span>
          </button>
        </div>
        <img 
          src={imageUrl} 
          alt={name}
          className={styles.mage}
        />
        <div className={styles.imageDots}>
          {media.map((_, index) => (
            <button 
              key={index}
              className={`${styles.dot} ${index === currentImageIndex ? styles.dotActive : ''}`}
              onClick={() => goToImage(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    )
};

export default ImageCard;

