export type FiltersApiProps = {
  availableRooms: string[];
  availablePriceRange: {
    min: number;
    max: number;
  };
  availableAreaRange: {
    min: number;
    max: number;
  };
}

export type DropdownProps = {
  label: string;
  value: string | null;
  options: string[];
  isOpen: boolean;
  placeholder?: string;
  inactive?: boolean;
  onToggle: () => void;
}

export type RoomsDropdownProps = {
  selectedValue: string[];
  onReset: () => void;
  onApply: (value: string[]) => void;
  availableOptions?: string[]; 
}

export type CheckboxDropdownProps = {
  options: string[];
  selectedValue: string[];
  onReset: () => void;
  onApply: (value: string[]) => void;
  availableOptions?: string[]; 
}

export type RangeDropdownProps = {
  title: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  currency?: string;
  valueMin: string;
  valueMax: string;
  onReset: () => void;
  onApply: (min: string, max: string) => void;
}

export type RangeValue = {
  min: string;
  max: string;
}

export type FilterOption = {
  id: string;
  label: string;
  value: string | null;
  options: string[];
  inactive?: boolean;
  onSelect: (value: string, e: React.MouseEvent) => void;
}

export type {
  CheckboxDropdownProps as checkboxDropdownProps
};