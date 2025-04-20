import { JSX } from 'react';
import styles from './cards.module.scss'

type PropertyIconProps = {
    type: 'livingArea' | 'kitchenArea' | 'floor' | 'area';
  }

function PropertyIcon({ type }: PropertyIconProps): JSX.Element {
    switch (type) {
      case 'livingArea':
        return <span className={styles.iconContainer}>🏠</span>;
      case 'kitchenArea':
        return <span className={styles.iconContainer}>🍽️</span>;
      case 'floor':
        return <span className={styles.iconContainer}>📐</span>;
      case 'area':
        return <span className={styles.iconContainer}>🌳</span>;
      default:
        return <span className={styles.iconContainer}>📊</span>;
    }
} 
  
export default PropertyIcon