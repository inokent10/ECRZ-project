import { JSX, useState } from "react";
import styles from './cards.module.scss';
import { Media, CardsEntity } from "@/types/cards-types/cards-types";
import { DEFAULT_IMAGES } from "@/const";

type ImageProps = {
    name: string;
    media: Media[];
    type: CardsEntity['type'];
}

function ImageCard({ name, media, type }: ImageProps): JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    const imagesCount = Math.max(media.length, DEFAULT_IMAGES[type].length);
    return Math.floor(Math.random() * imagesCount);
});
    
    const images = media.length > 0 
    ? media.map((m, i) => ({
        url: m.url,
        fallback: DEFAULT_IMAGES[type][i % 3] 
    })) 
    : DEFAULT_IMAGES[type].map(url => ({ url, fallback: url })); 

const currentImage = images[currentImageIndex % images.length];
    
    const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
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
          src={currentImage.url} 
          alt={name}
        />
        <div className={styles.imageDots}>
          {images.map((_, index) => (
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

