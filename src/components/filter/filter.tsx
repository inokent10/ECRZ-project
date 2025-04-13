import React, { JSX, useEffect, useState } from "react";
import styles from './filter.module.scss';
import { DYNAMIC_FIELD_OPTIONS, PropertyTypeEnum, TYPE_DISPLAY_NAMES, TYPE_OPTIONS } from "components/const";
import { getDynamicLabel } from "./utils";
import { Dropdown, RoomsDropdown, CheckboxDropdown, RangeDropdown } from "./dropdowns";
import AddFiltersIcon from "./add-filters-icon";

function Filter(): JSX.Element {
  const [selectedType, setSelectedType] = useState<PropertyTypeEnum>(PropertyTypeEnum.Apartments);
  const [selectedDynamic, setSelectedDynamic] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [areaRange, setAreaRange] = useState({ min: "", max: "" });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const isOpen = (name: string) => openDropdown === name;
  const closeDropdowns = () => setOpenDropdown(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (!target.closest(`.${styles.filterItem}, .${styles.dropdownContent}`)) {
        closeDropdowns();
      }
    };

    if (openDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);


  const handleTypeSelect = (displayValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const enumValue = Object.entries(TYPE_DISPLAY_NAMES).find(
      ([_, value]) => value === displayValue
    )?.[0] as PropertyTypeEnum;
    
    if (enumValue) {
      setSelectedType(enumValue);
      setSelectedDynamic([]);
      closeDropdowns();
    }
  };

  const handleDynamicSelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDynamic(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
    closeDropdowns();
  };

  const handleReset = () => {
    if (openDropdown === 'dynamic') {
      setSelectedDynamic([]);
    } else if (openDropdown === 'price') {
      setPriceRange({ min: "", max: "" });
    } else if (openDropdown === 'area') {
      setAreaRange({ min: "", max: "" });
    }
  };

  const handleDynamicApply = (values: string[]) => {
    setSelectedDynamic(values);
    closeDropdowns();
  };

  const renderDropdownContent = () => {
    if (openDropdown === 'type') {
      return (
        <ul className={styles.typeDropdown}>
          {TYPE_OPTIONS.map((option) => (
            <li key={option} onClick={(e) => handleTypeSelect(option, e)}>
              {option}
            </li>
          ))}
        </ul>
      );
    } else if (openDropdown === 'dynamic') {
      if (selectedType === PropertyTypeEnum.Apartments) {
        return (
          <RoomsDropdown 
            selectedValue={selectedDynamic}
            onReset={handleReset}
            onApply={handleDynamicApply}
          />
        );
      } else {
        return (
          <CheckboxDropdown 
            options={DYNAMIC_FIELD_OPTIONS[selectedType] || []}
            selectedValue={selectedDynamic}
            onReset={handleReset}
            onApply={handleDynamicApply}
          />
        );
      }
    } else if (openDropdown === 'price') {
      return (
        <RangeDropdown 
          title="Стоимость"
          minPlaceholder="10"
          maxPlaceholder="20"
          currency="₽"
          valueMin={priceRange.min}
          valueMax={priceRange.max}
          onReset={() => setPriceRange({ min: "", max: "" })}
          onApply={(min, max) => {
            setPriceRange({ min, max });
            closeDropdowns();
          }}
        />
      );
    } else if (openDropdown === 'area') {
      return (
        <RangeDropdown 
          title="Площадь"
          minPlaceholder="20"
          maxPlaceholder="40"
          currency={selectedType === PropertyTypeEnum.Apartments ? "м²" : "сот."}
          valueMin={areaRange.min}
          valueMax={areaRange.max}
          onReset={() => setAreaRange({ min: "", max: "" })}
          onApply={(min, max) => {
            setAreaRange({ min, max });
            closeDropdowns();
          }}
        /> 
      );
    }
    
    return null;
  };
  
  const filterOptions = [
    {
      id: 'type',
      label: 'Тип',
      value: TYPE_DISPLAY_NAMES[selectedType],
      placeholder: 'Тип',
      inactive: false,
      onSelect: handleTypeSelect
    },
    {
      id: 'dynamic',
      label: getDynamicLabel(selectedType),
      value: selectedDynamic.length > 0 ? selectedDynamic.join(', ') : null,
      placeholder: getDynamicLabel(selectedType),
      inactive: !selectedDynamic,
      onSelect: handleDynamicSelect
    },
    {
      id: 'price',
      label: 'Стоимость',
      value: priceRange.min || priceRange.max ? `${priceRange.min} - ${priceRange.max} тыс.` : null,
      placeholder: 'Стоимость',
      inactive: !priceRange.min && !priceRange.max,
      onSelect: () => {}
    },
    {
      id: 'area',
      label: 'Площадь',
      value: areaRange.min || areaRange.max ? `${areaRange.min} - ${areaRange.max} ${selectedType === PropertyTypeEnum.Apartments ? "м²" : "сот."}` : null,
      placeholder: 'Площадь',
      inactive: !areaRange.min && !areaRange.max,
      onSelect: () => {}
    }
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter}>
        {filterOptions.map(option => (
          <div key={option.id} className={styles.filterItem}>
            <Dropdown
              label={option.label}
              value={option.value}
              options={[]}
              isOpen={isOpen(option.id)}
              placeholder={option.placeholder}
              inactive={option.inactive}
              onToggle={() => toggleDropdown(option.id)}
            />
            
            {isOpen(option.id) && (
              <div className={`${styles.dropdownContent} ${option.id === 'type' ? styles.typeDropdownContent : ''}`}>
                {renderDropdownContent()}
              </div>
            )}
          </div>
        ))}
        <div className={styles.filterButtonsWrapper}>
          <button className={styles.filterMoreButton}>
            <AddFiltersIcon />
            <span>Доп.Фильтры</span>
          </button>
          <button
            className={`${styles.filterShowButton} ${styles.isDisabledButton}`}>
            Показать
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;