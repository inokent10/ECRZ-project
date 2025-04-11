import React, { JSX, useState } from "react";
import styles from './filter.module.scss';
import { DYNAMIC_FIELD_OPTIONS, PropertyTypeEnum, TYPE_DISPLAY_NAMES, TYPE_OPTIONS } from "components/const";
import { DynamicOption } from "types/filter-types";
import { getDynamicLabel } from "./utils";

interface DropdownProps {
  label: string;
  value: string | null;
  options: string[];
  isOpen: boolean;
  placeholder?: string;
  inactive?: boolean;
  onToggle: () => void;
  onSelect: (value: string, e: React.MouseEvent) => void;
}

const Dropdown = ({
  label,
  value,
  options,
  isOpen,
  placeholder,
  inactive = false,
  onToggle,
  onSelect
}: DropdownProps): JSX.Element => {
  const displayValue = value || placeholder || "";
  
  return (
    <div
      className={`${styles.select} ${inactive ? styles.inactiveState : ""}`}
      onClick={onToggle}
    >
      {(value || !placeholder) && (
        <div className={styles.label}>
          {label}
        </div>
      )}

      <div className={styles.typeLayout}>
        <span style={!value && placeholder ? { color: '#73777c' } : {}}>
          {displayValue}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}></span>
        
        {isOpen && (
          <ul className={styles.dropdown}>
            {options.map((option) => (
              <li key={option} onClick={(e) => onSelect(option, e)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

function Filter(): JSX.Element {
  const [selectedType, setSelectedType] = useState<PropertyTypeEnum>(PropertyTypeEnum.Apartments);
  const [selectedDynamic, setSelectedDynamic] = useState<DynamicOption>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const isOpen = (name: string) => openDropdown === name;

  const closeDropdowns = () => setOpenDropdown(null);

  const handleTypeSelect = (displayValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
      const enumValue = Object.entries(TYPE_DISPLAY_NAMES).find(
        ([_, value]) => value === displayValue
      )?.[0] as PropertyTypeEnum;
      
      if (enumValue) {
        setSelectedType(enumValue);
        setSelectedDynamic(null);
        closeDropdowns();
      }
  };

  const handleDynamicSelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDynamic(value as DynamicOption);
    closeDropdowns();
  };
  
  const filterOptions = [
    {
      id: 'type',
      label: 'Тип',
      value: TYPE_DISPLAY_NAMES[selectedType],
      options: TYPE_OPTIONS,
      onSelect: handleTypeSelect
    },
    {
      id: 'dynamic',
      label: getDynamicLabel(selectedType),
      value: selectedDynamic,
      options: DYNAMIC_FIELD_OPTIONS[selectedType] || [],
      placeholder: getDynamicLabel(selectedType),
      inactive: !selectedDynamic,
      onSelect: handleDynamicSelect
    }
  ];

  return (
    <>
      {filterOptions.map(option => (
        <Dropdown
          key={option.id}
          label={option.label}
          value={option.value}
          options={option.options}
          isOpen={isOpen(option.id)}
          placeholder={option.placeholder}
          inactive={option.inactive}
          onToggle={() => toggleDropdown(option.id)}
          onSelect={option.onSelect}
        />
      ))}
    </>
  );
}

export default Filter;