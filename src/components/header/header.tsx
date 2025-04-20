import { JSX, useEffect, useRef, useState } from "react";
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import Filter from "../filter/filter";
import SortMenu from "../sort-menu/sort-menu";

import { PropertyTypeEnum, SORT_OPTIONS, TYPE_SHOW_NAMES } from "../../const";
import styles from './header.module.scss'
import { ApartymentFiltersProps, FilterParams, HousesFiltersProps } from "@/types/filter-types/filter-types";

type HeaderProps = {
    activePropertyType: PropertyTypeEnum;
    filters: ApartymentFiltersProps | HousesFiltersProps | null;
    sortOptions: typeof SORT_OPTIONS;
    currentSort: string;
    totalItems: number;
    onSortChange: (value: string) => void;
    onPropertyTypeChange: (type: PropertyTypeEnum) => void;
    onFilterApply: (filter: FilterParams) => void;
  };

function Header({ 
    activePropertyType, 
    onPropertyTypeChange,
    filters,
    onFilterApply,
    sortOptions,
    currentSort,
    onSortChange,
    totalItems
  }: HeaderProps): JSX.Element {
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
                    <h1 className={styles.title}>
                        Купить {TYPE_SHOW_NAMES[activePropertyType]}
                    </h1>
                    <p className={styles.totalCount}>{totalItems} результатов</p>
                </div>
                <div ref={sortMenuRef}>
                <SortMenu
                    options={sortOptions}
                    currentOption={currentSort}
                    onSortChange={onSortChange}
                    onOpen={setIsOpen}
                    isOpen={isOpen}
                />
                </div>
            </div>

            <Filter
                propertyType={activePropertyType}
                onPropertyTypeChange={onPropertyTypeChange}
                availableFilters={filters}
                onFilterApply={onFilterApply}
            />
        </>
    )
};

export default Header;

