import React, { JSX, useEffect, useState, useCallback } from "react";
import styles from './filter.module.scss';
import { getDynamicLabel } from "./utils";
import { DYNAMIC_FIELD_OPTIONS, PropertyTypeEnum, TYPE_DISPLAY_NAMES, TYPE_OPTIONS } from "../../const";
import { Dropdown, RoomsDropdown, CheckboxDropdown, RangeDropdown } from "./dropdowns";
import AddFiltersIcon from "./add-filters-icon";
import {
  ApartymentFiltersProps,
  FilterOption,
  HousesFiltersProps,
  RangeValue,
  FilterParams,
  FilterChoices,
  ApartmentFilterParams,
  HouseFilterParams
} from "@/types/filter-types/filter-types";

type FilterProps = {
  propertyType: PropertyTypeEnum;
  availableFilters: ApartymentFiltersProps | HousesFiltersProps | null;
  onPropertyTypeChange: (type: PropertyTypeEnum) => void;
  onFilterApply: (filters: FilterParams) => void;
};

function Filter({ propertyType, availableFilters, onPropertyTypeChange, onFilterApply }: FilterProps): JSX.Element {
  const [selectedDynamic, setSelectedDynamic] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<RangeValue>({ min: "", max: "" });
  const [areaRange, setAreaRange] = useState<RangeValue>({ min: "", max: "" });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [filterChanged, setFilterChanged] = useState<boolean>(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyTypeEnum>(propertyType)
    
  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const isOpen = (name: string) => openDropdown === name;
  const closeDropdowns = () => setOpenDropdown(null);

  useEffect(() => {
    if (!availableFilters || !Array.isArray(availableFilters)) {
      setAvailableOptions([]);
      return;
    }
    
    const choicesFilter = availableFilters.find(filter => 
      filter.type === 'choices' && 
      ((propertyType === PropertyTypeEnum.Apartments && filter.key === 'roomType') || 
       (propertyType === PropertyTypeEnum.Houses && filter.key === 'houseType'))
    ) as FilterChoices | undefined;

    if (choicesFilter && choicesFilter.choices) {
      const options = choicesFilter.choices.map(choice => choice.name);
      setAvailableOptions(options);
    } else {
      setAvailableOptions([]);
    }
  }, [availableFilters, propertyType]);

  useEffect(() => {
    setSelectedDynamic([]);
    setPriceRange({ min: "", max: "" });
    setAreaRange({ min: "", max: "" });
    setFilterChanged(false);
  }, [propertyType]);

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
      ([, value]) => value === displayValue
    )?.[0] as PropertyTypeEnum;
    
    if (enumValue) {
      setSelectedPropertyType(enumValue);
      closeDropdowns();
      setFilterChanged(true);
    }
  };

  const handleDynamicSelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDynamic(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
    setFilterChanged(true);
  };

  const handleReset = () => {
    if (openDropdown === 'dynamic') {
      setSelectedDynamic([]);
    } else if (openDropdown === 'price') {
      setPriceRange({ min: "", max: "" });
    } else if (openDropdown === 'area') {
      setAreaRange({ min: "", max: "" });
    }
    setFilterChanged(true);
  };

  const handleDynamicApply = (values: string[]) => {
    setSelectedDynamic(values);
    closeDropdowns();
    setFilterChanged(true);
  };

  const handlePriceApply = (min: string, max: string) => {
    setPriceRange({ min, max });
    closeDropdowns();
    setFilterChanged(true);
  };

  const handleAreaApply = (min: string, max: string) => {
    setAreaRange({ min, max });
    closeDropdowns();
    setFilterChanged(true);
  };

  const findServerValueByDisplayName = (displayName: string, propertyType: PropertyTypeEnum): string | undefined => {
    if (!availableFilters || !Array.isArray(availableFilters)) return undefined;
    
    const key = propertyType === PropertyTypeEnum.Apartments ? 'roomType' : 'houseType';
    const choicesFilter = availableFilters.find(filter => 
      filter.type === 'choices' && filter.key === key
    ) as FilterChoices;
    
    if (!choicesFilter) return undefined;
    
    const choice = choicesFilter.choices.find(c => c.name === displayName.toString());

    return choice?.key;
  };

  const prepareFilterParams = useCallback((): FilterParams => {
    if (propertyType === PropertyTypeEnum.Apartments) {
      const params: ApartmentFilterParams = {};
      
      if (selectedDynamic.length > 0) {
        params.roomType = selectedDynamic.map(room =>
          findServerValueByDisplayName(room, PropertyTypeEnum.Apartments) || room
        );
      }
      
      if (priceRange.min) params.priceMin = priceRange.min;
      if (priceRange.max) params.priceMax = priceRange.max;
      
      if (areaRange.min) params.totalAreaMin = areaRange.min;
      if (areaRange.max) params.totalAreaMax = areaRange.max;
      
      return params;
    } else {
      const params: HouseFilterParams = {};
      
      if (selectedDynamic.length > 0) {
        params.houseType = selectedDynamic.map(type =>
          findServerValueByDisplayName(type, PropertyTypeEnum.Houses) || type
        );
      }
      
      if (priceRange.min) params.priceMin = priceRange.min;
      if (priceRange.max) params.priceMax = priceRange.max;
      
      if (areaRange.min) params.totalAreaMin = areaRange.min;
      if (areaRange.max) params.totalAreaMax = areaRange.max;
      
      return params;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDynamic, priceRange, areaRange, propertyType, availableFilters]);

  const handleShowResults = () => {
  if (selectedPropertyType !== propertyType) {
    onPropertyTypeChange(selectedPropertyType);
  } else {
    const filterParams = prepareFilterParams();
    onFilterApply(filterParams);
  }
  setFilterChanged(false);
  };

  const getDynamicOptions = (): string[] => {
    if (!availableFilters || !Array.isArray(availableFilters)) return [];

    const keyMap: Record<PropertyTypeEnum, string> = {
      [PropertyTypeEnum.Apartments]: 'roomType',
      [PropertyTypeEnum.Houses]: 'houseType',
      [PropertyTypeEnum.Lands]: '',
      [PropertyTypeEnum.Commercial]: '',
    };
  
    const key = keyMap[propertyType];
    
    const choicesFilter = availableFilters.find(filter => 
      filter.type === 'choices' && filter.key === key
    ) as FilterChoices | undefined;

    if (!choicesFilter || !choicesFilter.choices) return [];

    return choicesFilter.choices.map(choice => choice.name);
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
      if (propertyType === PropertyTypeEnum.Apartments) {
        return (
          <RoomsDropdown 
            selectedValue={selectedDynamic}
            onReset={handleReset}
            onApply={handleDynamicApply}
            availableOptions={availableOptions}
          />
        );
      } else {
        return (
          <CheckboxDropdown
            options={getDynamicOptions()}
            selectedValue={selectedDynamic}
            onReset={handleReset}
            onApply={handleDynamicApply}
            availableOptions={availableOptions}
          />
        );
      }
    } else if (openDropdown === 'price') {
      return (
        <RangeDropdown 
          title="Стоимость"
          minPlaceholder="От"
          maxPlaceholder="До"
          currency="₽"
          valueMin={priceRange.min}
          valueMax={priceRange.max}
          onReset={() => setPriceRange({ min: "", max: "" })}
          onApply={handlePriceApply}
        />
      );
    } else if (openDropdown === 'area') {
      return (
        <RangeDropdown 
          title="Площадь"
          minPlaceholder="От"
          maxPlaceholder="До"
          currency={propertyType === PropertyTypeEnum.Apartments ? "м²" : "сот."}
          valueMin={areaRange.min}
          valueMax={areaRange.max}
          onReset={() => setAreaRange({ min: "", max: "" })}
          onApply={handleAreaApply}
        /> 
      );
    }
    
    return null;
  };
  
  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: 'Тип',
      value: TYPE_DISPLAY_NAMES[selectedPropertyType],
      options: TYPE_OPTIONS,
      inactive: false,
      onSelect: handleTypeSelect
    },
    {
      id: 'dynamic',
      label: getDynamicLabel(selectedPropertyType),
      value: selectedDynamic.length > 0 ? selectedDynamic.join(', ') : null,
      options: DYNAMIC_FIELD_OPTIONS[selectedPropertyType],
      inactive: !selectedDynamic.length,
      onSelect: handleDynamicSelect
    },
    {
      id: 'price',
      label: 'Стоимость',
      value: priceRange.min || priceRange.max ? `${priceRange.min || '0'} - ${priceRange.max || '∞'} руб.` : null,
      options: [],
      inactive: !priceRange.min && !priceRange.max,
      onSelect: () => {}
    },
    {
      id: 'area',
      label: 'Площадь',
      value: areaRange.min || areaRange.max ?
        `${areaRange.min || '0'} - ${areaRange.max || '∞'} ${propertyType === PropertyTypeEnum.Apartments ?
          "м²" : "сот."}` : null,
      options: [],
      inactive: !areaRange.min && !areaRange.max,
      onSelect: () => {}
    }
  ];

  const hasActiveFilters = 
    selectedPropertyType !== propertyType ||
    selectedDynamic.length > 0 || 
    priceRange.min || 
    priceRange.max || 
    areaRange.min || 
    areaRange.max;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter}>
        {filterOptions.map(option => (
          <div key={option.id} className={styles.filterItem}>
            <Dropdown
              label={option.label}
              value={option.value}
              options={option.options}
              isOpen={isOpen(option.id)}
              placeholder={option.label}
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
            className={`${styles.filterShowButton} ${(!hasActiveFilters || !filterChanged) ? styles.isDisabledButton : ''}`}
            onClick={handleShowResults}
            disabled={!hasActiveFilters || !filterChanged}
          >
            Показать
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;