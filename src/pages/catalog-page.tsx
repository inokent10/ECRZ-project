import { JSX, useEffect, useState} from "react";

import { fetchApartmentFiltersAction, fetchApartmentsAction } from "@/store/slice/apartment-slice/apartment-slice";
import { fetchHouseFiltersAction, fetchHousesAction } from "@/store/slice/houses-slice/houses-slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

import styles from './catalog-page.module.scss'
import { PropertyTypeEnum } from "@/const";

import CardsList from "@/components/cards/cards-list";
import Header from "@/components/header/header";
import SpinnerLoader from "@/components/spinner-loader/spiner-loader";

const FIRST_PAGE_NUMBER = 1;

function CatalogPage(): JSX.Element {
    const dispatch = useAppDispatch();
    const [activePropertyType, setActivePropertyType] = useState<PropertyTypeEnum>(PropertyTypeEnum.Apartments);

    const { 
        apartments, 
        filters: apartmentFilters, 
        isLoading: isApartmentsLoading, 
        error: apartmentsError 
      } = useAppSelector((state) => state.apartments);
      
      const { 
        houses, 
        filters: houseFilters, 
        isLoading: isHousesLoading, 
        error: housesError 
      } = useAppSelector((state) => state.houses);

    const isLoading = activePropertyType === PropertyTypeEnum.Apartments 
        ? isApartmentsLoading : isHousesLoading;
    
    const error = activePropertyType === PropertyTypeEnum.Apartments 
        ? apartmentsError : housesError;
    
    const currentCards = activePropertyType === PropertyTypeEnum.Apartments 
        ? apartments : houses;

    const currentFilters = activePropertyType === PropertyTypeEnum.Apartments 
        ? apartmentFilters : houseFilters;
    
    const handlePropertyTypeChange = (type: PropertyTypeEnum) => {
            setActivePropertyType(type);
    };

    const handlePageChange = (page: number) => {
        if (activePropertyType === PropertyTypeEnum.Apartments) {
            dispatch(fetchApartmentsAction(page));
        } else {
            dispatch(fetchHousesAction(page));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activePropertyType === PropertyTypeEnum.Apartments) {
                    dispatch(fetchApartmentsAction(FIRST_PAGE_NUMBER));
                    dispatch(fetchApartmentFiltersAction());
                } else {
                    dispatch(fetchHousesAction(FIRST_PAGE_NUMBER))
                    dispatch(fetchHouseFiltersAction())
                }
            } catch {
               return error
            }
        }

        fetchData();
    }, [activePropertyType, dispatch, error])

    return (
        <div className={styles.wrapper}>
            <Header
                activePropertyType={activePropertyType} 
                onPropertyTypeChange={handlePropertyTypeChange}
                filters={currentFilters}
            />
            
            {isLoading && <SpinnerLoader />}
            {error && <h2>{error}</h2>}

            <CardsList cards={currentCards} onPageChange={handlePageChange} />
        </div>
    )
}

export default CatalogPage;