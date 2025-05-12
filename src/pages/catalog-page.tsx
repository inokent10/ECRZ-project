import { JSX, useEffect, useMemo, useState, useRef } from "react";

import { fetchApartmentFiltersAction, fetchApartmentsAction } from "@/store/slice/apartment-slice/apartment-slice";
import { fetchHouseFiltersAction, fetchHousesAction } from "@/store/slice/houses-slice/houses-slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

import styles from './catalog-page.module.scss'
import { PropertyTypeEnum, SORT_OPTIONS, SortOptionValue } from "@/const";

import CardsList from "@/components/cards/cards-list";
import Header from "@/components/header/header";
import SpinnerLoader from "@/components/spinner-loader/spiner-loader";
import { sortProperties } from "@/components/sort-menu/sort-utils";
import { ApartmentEntity, ApiResponse, HouseEntity } from "@/types/cards-types/cards-types";
import { FilterParams } from "@/types/filter-types/filter-types";
import { isApartmentFilters, isHouseFilters, normalizeHouseType, normalizeRoomType } from "@/components/filter/utils";

const FIRST_PAGE_NUMBER = 1;

function CatalogPage(): JSX.Element {
    const dispatch = useAppDispatch();
    const [activePropertyType, setActivePropertyType] = useState<PropertyTypeEnum>(PropertyTypeEnum.Apartments);
    const [activeFilters, setActiveFilters] = useState<FilterParams>({});
    const [currentPage, setCurrentPage] = useState(FIRST_PAGE_NUMBER);
    const [currentSort, setCurrentSort] = useState<string>(SortOptionValue.Relevance);
    const isMounted = useRef(true);
    
    const { 
        apartments,
        filters: apartmentFilters,
        isLoading: isApartmentsLoading,
        isFiltersLoading: isApartmentFiltersLoading,
        error: apartmentsError
      } = useAppSelector((state) => state.apartments);
      
      const {
        houses,
        filters: houseFilters,
        isLoading: isHousesLoading,
        isFiltersLoading: isHouseFiltersLoading,
        error: housesError
      } = useAppSelector((state) => state.houses);
    
      const isValidPropertyType = activePropertyType === PropertyTypeEnum.Apartments || 
      activePropertyType === PropertyTypeEnum.Houses;

    const isLoading = activePropertyType === PropertyTypeEnum.Apartments
        ? isApartmentsLoading || isApartmentFiltersLoading
        : isHousesLoading || isHouseFiltersLoading;
    
    const error = activePropertyType === PropertyTypeEnum.Apartments
        ? apartmentsError
        : housesError;

    const filteredAndSortedCards = useMemo(() => {
        if (!isValidPropertyType) {
            return { entities: [], totalItems: 0 } as unknown as ApiResponse<ApartmentEntity | HouseEntity>;
        }
        
        const cards = activePropertyType === PropertyTypeEnum.Apartments ? apartments : houses;
        
        const result = { ...cards } as ApiResponse<ApartmentEntity | HouseEntity>;
        let filtered = [...cards.entities];

        if (isApartmentFilters(activeFilters) && activeFilters.roomType?.length) {
            filtered = filtered.filter((card) => {
                const apartmentCard = card as ApartmentEntity;
                return activeFilters.roomType?.includes(normalizeRoomType(apartmentCard.roomType));
            });
        }
        
        if (isHouseFilters(activeFilters) && activeFilters.houseType?.length) {
            filtered = filtered.filter((card) => {
                const houseCard = card as HouseEntity;
                return activeFilters.houseType?.includes(normalizeHouseType(houseCard.houseType));
            });
        }
        
        if (activeFilters.priceMin || activeFilters.priceMax) {
            filtered = filtered.filter((card) => {
                const priceMin = activeFilters.priceMin ? parseFloat(activeFilters.priceMin) : 0;
                const priceMax = activeFilters.priceMax ? parseFloat(activeFilters.priceMax) : Infinity;
                return card.priceUsd >= priceMin && (priceMax ? card.priceUsd <= priceMax : true);
            });
        }
        
        if (activeFilters.totalAreaMin || activeFilters.totalAreaMax) {
            filtered = filtered.filter((card) => {
                const areaMin = activeFilters.totalAreaMin ? parseFloat(activeFilters.totalAreaMin) : 0;
                const areaMax = activeFilters.totalAreaMax ? parseFloat(activeFilters.totalAreaMax) : Infinity;
                return card.totalArea >= areaMin && (areaMax ? card.totalArea <= areaMax : true);
            });
        }

        result.entities = filtered;

        return sortProperties(result, currentSort);
    }, [isValidPropertyType, activePropertyType, apartments, houses, activeFilters, currentSort]);

    const currentFilters = activePropertyType === PropertyTypeEnum.Apartments 
    ? apartmentFilters : houseFilters;
    
    const handleFilterApply = (filters: FilterParams) => {
        setActiveFilters(filters);
        setCurrentPage(FIRST_PAGE_NUMBER);
    };
    
    const handlePropertyTypeChange = (type: PropertyTypeEnum) => {
        setActivePropertyType(type);
        setCurrentPage(FIRST_PAGE_NUMBER);
        setActiveFilters({});
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = (sortValue: string) => {
        setCurrentSort(sortValue);
        setCurrentPage(FIRST_PAGE_NUMBER);
    };

    useEffect(() => {
        const controller = new AbortController();
        
        const loadData = async () => {
            try {
                if (activePropertyType === PropertyTypeEnum.Apartments) {
                    dispatch(fetchApartmentsAction({
                        page: currentPage,
                        signal: controller.signal
                    }));
                } else if (activePropertyType === PropertyTypeEnum.Houses) {
                    dispatch(fetchHousesAction({
                        page: currentPage,
                        signal: controller.signal
                    }));
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Ошибка загрузки данных:', err);
                }
            }
        };
        
        loadData();
        
        return () => {
            controller.abort();
        };
    }, [activePropertyType, currentPage, dispatch]);

    useEffect(() => {
        const controller = new AbortController();
        
        const loadFilters = async () => {
            try {
                if (activePropertyType === PropertyTypeEnum.Apartments) {
                    dispatch(fetchApartmentFiltersAction(controller.signal));
                } else if (activePropertyType === PropertyTypeEnum.Houses) {
                    dispatch(fetchHouseFiltersAction(controller.signal));
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Ошибка загрузки фильтров:', err);
                }
            }
        };
        
        loadFilters();
        
        return () => {
            controller.abort();
        };
    }, [activePropertyType, dispatch]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    
    return (
        <div className={styles.wrapper}>
            <Header
                activePropertyType={activePropertyType} 
                onPropertyTypeChange={handlePropertyTypeChange}
                filters={currentFilters}
                onFilterApply={handleFilterApply}
                sortOptions={SORT_OPTIONS}
                currentSort={currentSort}
                onSortChange={handleSortChange}
                totalItems={filteredAndSortedCards.totalItems}
            />
            
            {isLoading && <SpinnerLoader />}
            {error && <h2>{error}</h2>}

            {
                !isValidPropertyType ? (
                    <>
                        <h2>Нет доступных объектов</h2>
                    </>
                ): (
                    <CardsList
                        cards={filteredAndSortedCards}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                )
            }
        </div>
    )
}

export default CatalogPage;