import { JSX } from "react";
import styles from './sort-menu.module.scss';
import SortingIcon from './sort-icon';

type SortOption = {
    name: string;
    value: string;
  };

type SortMenuProps = {
    options: SortOption[];
    currentOption: string;
    isOpen: boolean;
    onSortChange: (value: string) => void;
    onOpen: (isOpen: boolean) => void;
}

function SortMenu({ options, currentOption, onSortChange, onOpen, isOpen }: SortMenuProps): JSX.Element {
    const currentOptionName = options?.find(opt => opt.value === currentOption)?.name || 'Сортировка';
    
    return (
        <div className={styles.sortContainer}>
             <button 
                className={styles.sortButton}
                onClick={() => onOpen(!isOpen)}
                aria-haspopup="listbox"
            >
                <SortingIcon />
                <span>{currentOptionName}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}></span>
            </button> 

            {isOpen &&
                (
                <ul className={styles.sortList} role="listbox">
                    {
                        options?.map((option) => (
                            <li
                                key={option.value}
                                className={`${styles.sortItem} ${currentOption === option.value ? styles.active : ''}`}
                                onClick={() => {
                                    onSortChange(option.value);
                                    onOpen(false);
                                }}
                                role="option"
                                aria-selected={currentOption === option.value}
                            >
                                {option.name}
                            </li>
                        ))
                    }
                </ul>
                )
            }
        </div>
    )
}

export default SortMenu;