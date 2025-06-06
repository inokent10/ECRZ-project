import { JSX, useEffect, useState } from "react";
import { DropdownProps, RoomsDropdownProps, checkboxDropdownProps, RangeDropdownProps } from "@/types/filter-types/filter-types";
import styles from './filter.module.scss';
import { REG_ONLY_NUMBERS } from "../../const";

const Dropdown = ({
  label,
  value,
  isOpen,
  placeholder,
  inactive = false,
  onToggle,
}: DropdownProps): JSX.Element => {
  const displayValue = value || placeholder || "";
  
  return (
    <div
      className={`${styles.select} ${inactive ? styles.inactiveState : ""}`}
      onClick={onToggle}
    >
      {value && (
        <div className={styles.label}>
          {label}
        </div>
      )}

      <div className={styles.typeLayout}>
        <span style={!value ? { color: '#000000' } : {}}>
          {value ? displayValue : label}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}></span>
      </div>
    </div>
  );
};

const RoomsDropdown = ({ selectedValue, onReset, onApply, availableOptions }: RoomsDropdownProps) => {
  const [localSelected, setLocalSelected] = useState([...selectedValue]);
  const normalizeOptions = (options: string[]) => {
    const normalized = options.map(option => {
      if (option === 'Студия') return 'Студия';
      const match = option.match(/(\d+)(\+?)-к\. квартира/);
      return match ? `${match[1]}${match[2] || ''}` : option;
    });
    
    return [...new Set(normalized)];
  };
  const defaultRoomOptions = ['Студия', '1', '2', '3', '4+'];

  const roomOptions = availableOptions && availableOptions.length > 0
  ? normalizeOptions(availableOptions) 
    : defaultRoomOptions

  useEffect(() => {
    setLocalSelected(selectedValue);
  }, [selectedValue]);
    
  const handleSelect = (room: string) => {
    const newSelection = localSelected.includes(room)
      ? localSelected.filter(item => item !== room)
      : [...localSelected, room];
          
    setLocalSelected(newSelection);
  };
    
  const handleApply = () => onApply(localSelected);

  const isOptionAvailable = (option: string): boolean => roomOptions.includes(option);
  
  return (
    <div className={styles.roomsDropdown}>
      <div className={styles.roomOptionsContainer}>
        {defaultRoomOptions.map((room) => (
          <div 
            key={room}
            className={`
              ${styles.roomOption} 
              ${localSelected.includes(room) ? styles.selected : ''}
              ${!isOptionAvailable(room) ? styles.isDisabledButton : ''}
            `}
            onClick={() => isOptionAvailable(room) && handleSelect(room)}
          >
            {room}
          </div>
        ))}
      </div>
      
      <div className={styles.actionButtons}>
        <button className={styles.resetButton} onClick={onReset}>
          Сбросить
        </button>
        <button
          className={`${styles.applyButton} ${localSelected.length === 0 ? styles.isDisabledButton : ''}`}
          onClick={handleApply}
          disabled={localSelected.length === 0}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

const CheckboxDropdown = ({ options, selectedValue, onReset, onApply, availableOptions }: checkboxDropdownProps) => {
  const [localSelected, setLocalSelected] = useState([...selectedValue]);
  
  useEffect(() => {
    setLocalSelected(selectedValue);
  }, [selectedValue]);
    
  const handleSelect = (option: string) => {
    const newSelection = localSelected.includes(option)
      ? localSelected.filter(item => item !== option)
      : [...localSelected, option];
          
    setLocalSelected(newSelection);
  };
    
  const handleApply = () => {
    onApply(localSelected);
  };

  const isOptionAvailable = (option: string): boolean => {
    if (!availableOptions || availableOptions.length === 0) return true;
    
    return availableOptions.includes(option);
  };
      
  return (
    <div className={styles.checkboxDropdown}>
      <div className={styles.checkboxOptionsList}>
        {options.map((option) => (
          <div 
            key={option}
            className={`
              ${styles.checkboxOption}
              ${!isOptionAvailable(option) ? styles.disabled : ''}
            `}
            onClick={() => isOptionAvailable(option) && handleSelect(option)}
          >
            <input 
              type="checkbox" 
              id={option} 
              name="checkboxGroup" 
              checked={localSelected.includes(option)}
              disabled={!isOptionAvailable(option)}
              readOnly
            />
            <label className={!isOptionAvailable(option) ? styles.disabledText : ''}>
              {option}
            </label>
          </div>
        ))}
      </div>
      
      <div className={styles.actionButtons}>
        <button className={styles.resetButton} onClick={onReset}>
          Сбросить
        </button>
        <button
          className={`${styles.applyButton} ${localSelected.length === 0 ? styles.isDisabledButton : ''}`}
          onClick={handleApply}
          disabled={localSelected.length === 0}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

const RangeDropdown = ({
  title,
  minPlaceholder,
  maxPlaceholder,
  valueMin, 
  valueMax,
  currency,
  onReset,
  onApply
}: RangeDropdownProps) => {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
    
  const isDisabled = minValue === "" && maxValue === "";
    
  useEffect(() => {
    setMinValue(valueMin);
    setMaxValue(valueMax);
  }, [valueMin, valueMax]);
    
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(REG_ONLY_NUMBERS, '');
    setMinValue(value);
  };
    
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(REG_ONLY_NUMBERS, '');
    setMaxValue(value);
  };
    
  const handleApply = () => {
    onApply(minValue, maxValue);
  };
  
  return (
    <div className={styles.rangeDropdown}>
      <div className={styles.rangeContent}>
        <div className={styles.rangeTitle}>{title}</div>
        
        <div className={styles.rangeInputs}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={minPlaceholder}
              value={minValue}
              onChange={handleMinChange}
            />
            {currency && <span className={styles.currency}>{currency}</span>}
          </div>
          
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={maxPlaceholder}
              value={maxValue}
              onChange={handleMaxChange}
            />
            {currency && <span className={styles.currency}>{currency}</span>}
          </div>
        </div>
      </div>
      
      <div className={styles.actionButtons}>
        <button className={styles.resetButton} onClick={onReset}>
          Сбросить
        </button>
        <button
          className={`${styles.applyButton} ${isDisabled ? styles.isDisabledButton : ''}`}
          onClick={handleApply}
        >
          Применить
        </button>
      </div>
    </div>
  );
};  

export {
  Dropdown,
  RangeDropdown,
  CheckboxDropdown,
  RoomsDropdown
};