import { JSX, useEffect, useRef, useState } from "react";
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import Filter from "../filter/filter";
import SortMenu from "../sort-menu/sort-menu";

import { SORT_OPTIONS } from "../../const";
import styles from './header.module.scss'

function Header(): JSX.Element {
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
        <Breadcrumbs />
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

            <Filter />
        </>
    )
};

export default Header;

