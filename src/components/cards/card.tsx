import { JSX } from "react";
import { CardsEntity } from "@/types/cards-types/cards-types";
import styles from './cards.module.scss';
import ImageCard from "./image-card";
import PropertyIcon from "./property-icon";

type CardProperty = {
    card: CardsEntity;
}

function Card({ card }: CardProperty): JSX.Element {
    const formattedPriceUsd = new Intl.NumberFormat('en-US', { 
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(card.priceUsd);
      
      const formattedPriceByn = new Intl.NumberFormat('en-US', { 
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(card.priceByn);
    
      const formattedPricePerMeterUsd = new Intl.NumberFormat('en-US', { 
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(card.pricePerMeterUsd);
      
    return (
        <div className={styles.card}>
            <ImageCard name={card.name} media={card.media} type={card.type} />

            <div className={styles.cardContent}>
        {card.type === 'apartment' ? (
          <div className={styles.propertyTag}>
            Квартира в новостройке
          </div>
        ) : (
          <div className={styles.propertyTag}>
            {card.type === 'house' ? 'Дача' : ''}
          </div>
        )}

        <h2 className={styles.propertyTitle}>
          {card.type === 'apartment' ? (
            <>
              {card.roomType} квартира, {card.totalArea}м<sup>2</sup>
            </>
          ) : (
            <>
              {card.houseType}, {card.totalArea}м<sup>2</sup>
            </>
          )}
        </h2>

        <p className={styles.propertyAddress}>
          {card.location.shortAddress}
        </p>

        <div className={styles.divider}></div>

        <div className={styles.propertyFeatures}>
          {card.livingArea && (
            <div className={styles.feature}>
              <PropertyIcon type="livingArea" />
              <span>{card.livingArea}м<sup>2</sup></span>
            </div>
          )}
          
          {card.kitchenArea && (
            <div className={styles.feature}>
              <PropertyIcon type="kitchenArea" />
              <span>{card.kitchenArea}м<sup>2</sup></span>
            </div>
          )}
          
          {card.type === 'apartment' && card.floor && (
            <div className={styles.feature}>
              <PropertyIcon type="floor" />
              <span>{card.floor}/{card.floors} этаж</span>
            </div>
          )}
          
          {card.type === 'house' && (
            <div className={styles.feature}>
              <PropertyIcon type="area" />
              <span>10 сот.</span>
            </div>
          )}
        </div>

        <div className={styles.priceBlock}>
          <div className={styles.price}>
            <span className={styles.priceCurrency}>$</span> {formattedPriceUsd}
          </div>
          <div className={styles.priceByn}>
            BYN {formattedPriceByn}
          </div>
        </div>
        
        <div className={styles.pricePerMeter}>
          $ {formattedPricePerMeterUsd} / м<sup>2</sup>
        </div>
      </div>
        </div>
    )
};

export default Card;