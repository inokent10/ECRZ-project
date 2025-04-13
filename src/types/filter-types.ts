type DropdownProps = {
    label: string;
    value: string | null;
    options: string[];
    isOpen: boolean;
    placeholder?: string;
    inactive?: boolean;
    onToggle: () => void;
    onSelect: (value: string, e: React.MouseEvent) => void;
  }
  
  type RoomsDropdownProps = {
    selectedValue: string[];
    // onSelect: (value: string) => void;
    onReset: () => void;
    onApply: (value: string[]) => void;
  }
  
  type CheckboxDropdownProps = {
    options: string[];
    selectedValue: string[];
    // onSelect: (value: string) => void;
    onReset: () => void;
    onApply: (value: string[]) => void;
  }
  
  type RangeDropdownProps = {
    title: string;
    minPlaceholder: string;
    maxPlaceholder: string;
    currency?: string;
    valueMin: string;
    valueMax: string;
    onReset: () => void;
    onApply: (min: string, max: string) => void;
  }
  
  type RangeValue = {
    min: string;
    max: string;
  }
  
  type FilterOption = {
    id: string;
    label: string;
    value: string | null;
    options: string[];
    inactive?: boolean;
    onSelect: (value: string, e: React.MouseEvent) => void;
  }

export type {
    DropdownProps,
    FilterOption,
    CheckboxDropdownProps as checkboxDropdownProps,
    RangeDropdownProps,
    RangeValue,
    RoomsDropdownProps
  }