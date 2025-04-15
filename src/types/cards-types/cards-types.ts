export interface Media {
    id: string;
    url: string;
  }
  
  export interface Location {
    id: string;
    fullAddress: string;
    shortAddress: string;
    coordinates: string;
  }
  
  export interface BaseCardEntity {
    id: string;
    name: string;
    priceUsd: number;
    priceByn: number;
    totalArea: number;
    floors: number;
    floor: number;
    livingArea: number;
    kitchenArea: number;
    pricePerMeterUsd: number;
    pricePerMeterByn: number;
    location: Location;
    media: Media[];
    type: 'apartment' | 'house';
  }
  
  export interface ApartmentEntity extends BaseCardEntity {
    type: 'apartment';
    roomType: string;
  }
  
  export interface HouseEntity extends BaseCardEntity {
    type: 'house';
    houseType: string;
  }
  
  export type CardsEntity = ApartmentEntity | HouseEntity;
  
  export interface ApiResponse<T extends CardsEntity> {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    entities: T[];
  }
  
  export interface FetchPropertiesParams {
    propertyType: 'apartment' | 'house';
    page: number;
    limit: number;
  }
  
  export interface PropertiesState {
    currentType: 'apartment' | 'house';
    currentPage: number;
    totalPages: number;
    properties: CardsEntity[];
    isLoading: boolean;
    error: string | null;
  }