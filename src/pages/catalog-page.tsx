import { JSX, useEffect, useMemo, useState} from "react";

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

    const isLoading = activePropertyType === PropertyTypeEnum.Apartments 
        ? isApartmentsLoading || isApartmentFiltersLoading 
        : isHousesLoading || isHouseFiltersLoading;
    
    const error = activePropertyType === PropertyTypeEnum.Apartments 
        ? apartmentsError 
        : housesError;

    const filteredAndSortedCards = useMemo(() => {
        const cards = activePropertyType === PropertyTypeEnum.Apartments ? apartments : houses;

        const result = { ...cards }as ApiResponse<ApartmentEntity | HouseEntity>;
        let filtered= [ ...cards.entities ];

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
                const priceMax = activeFilters.priceMax ? parseFloat(activeFilters.priceMax) : 0;
                return card.priceUsd >= priceMin && card.priceUsd <= priceMax;
            });
        }
        
        if (activeFilters.totalAreaMin || activeFilters.totalAreaMax) {
            filtered = filtered.filter((card) => {
                const areaMin = activeFilters.totalAreaMin ? parseFloat(activeFilters.totalAreaMin) : 0;
                const areaMax = activeFilters.totalAreaMax ? parseFloat(activeFilters.totalAreaMax) : 0;
                return card.totalArea >= areaMin && card.totalArea <= areaMax;
            });
        }

        result.entities = filtered;

        return activePropertyType === PropertyTypeEnum.Apartments
            ? sortProperties(result, currentSort)
            : sortProperties(result, currentSort);
    }, [activePropertyType, apartments, houses, currentSort, activeFilters]);

    const currentFilters = activePropertyType === PropertyTypeEnum.Apartments 
        ? apartmentFilters : houseFilters;
    
    const handleFilterApply = (filters: FilterParams) => {
            setActiveFilters(filters);
            setCurrentPage(FIRST_PAGE_NUMBER);
            fetchData(FIRST_PAGE_NUMBER);
    };
    
    const fetchData = (page: number) => {
        try {
            if (activePropertyType === PropertyTypeEnum.Apartments) {
                dispatch(fetchApartmentsAction(page));
            } else {
                dispatch(fetchHousesAction(page));
            }
        } catch {
            return error;
        }
    }
    
    const handlePropertyTypeChange = (type: PropertyTypeEnum) => {
        setActivePropertyType(type);
        setCurrentPage(FIRST_PAGE_NUMBER);
        setActiveFilters({});
    };

    const handlePageChange = (page: number) => {
        if (activePropertyType === PropertyTypeEnum.Apartments) {
            setCurrentPage(page);
            fetchData(page);
        } else {
            setCurrentPage(page);
            fetchData(page);
        }
    };

    const handleSortChange = (sortValue: string) => {
            setCurrentSort(sortValue);
            setCurrentPage(FIRST_PAGE_NUMBER);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activePropertyType === PropertyTypeEnum.Apartments) {
                    dispatch(fetchApartmentsAction(currentPage));
                    dispatch(fetchApartmentFiltersAction());
                } else {
                    dispatch(fetchHousesAction(currentPage))
                    dispatch(fetchHouseFiltersAction())
                }
            } catch {
               return error
            }
        }

        fetchData();
    }, [activePropertyType, currentPage, dispatch, error])
    
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

            <CardsList
                cards={filteredAndSortedCards}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    )
}

export default CatalogPage;