import { JSX, useEffect, useRef, useState } from "react";

import Breadcrumbs from "../components/breadcrumbs/breadcrumbs";
import Filter from "components/filter/filter";
import SortMenu from "../components/sort-menu/sort-menu";

import styles from './catalog-page.module.scss'

import { SORT_OPTIONS } from "../components/const";

function CatalogPage(): JSX.Element {
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
        <div className={styles.wrapper}>
            <Breadcrumbs />
            <div className={styles.headerWrapper}>
                <div className={styles.titleWrapper}>
                    <h1>Купить 1-комнатную квартиру</h1>
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

            {/* <div className={styles.filterWrapper}> */}
                <Filter />
            {/* </div> */}
        </div>
    )
}

export default CatalogPage;