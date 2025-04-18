import { JSX, useEffect, useRef, useState } from "react";
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import Filter from "../filter/filter";
import SortMenu from "../sort-menu/sort-menu";

import { PropertyTypeEnum, SORT_OPTIONS } from "../../const";
import styles from './header.module.scss'
import { ApartmentFilters } from "@/store/slice/apartment-slice/apartment-slice";
import { HouseFilters } from "@/store/slice/houses-slice/houses-slice";

type HeaderProps = {
    activePropertyType: PropertyTypeEnum;
    onPropertyTypeChange: (type: PropertyTypeEnum) => void;
    filters: ApartmentFilters | HouseFilters | null;
  };

function Header({ 
    activePropertyType, 
    onPropertyTypeChange,
    filters
  }: HeaderProps): JSX.Element {
    const [currentSort, setCurrentSort] = useState('relevance')
    const [isOpen, setIsOpen] = useState(false);

    const sortMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && 
                !sortMenuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <>
            <Breadcrumbs activeType={activePropertyType} />
            
            <div className={styles.headerWrapper}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>Купить 1-комнатную квартиру</h1>
                    <p className={styles.totalCount}>100 результатов</p>
                </div>
                <div ref={sortMenuRef}>
                <SortMenu
                    options={SORT_OPTIONS}
                    currentOption={currentSort}
                    onSortChange={setCurrentSort}
                    onOpen={setIsOpen}
                    isOpen={isOpen}
                />
                </div>
            </div>

            <Filter
                propertyType={activePropertyType}
                onPropertyTypeChange={onPropertyTypeChange}
                availableFilters={filters}
            />
        </>
    )
};

export default Header;

