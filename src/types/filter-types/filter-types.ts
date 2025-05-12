export type ApartmentFilterParams = {
  roomType?: string[];
  priceMin?: string;
  priceMax?: string;
  totalAreaMin?: string;
  totalAreaMax?: string;
};

export type HouseFilterParams = {
  houseType?: string[];
  priceMin?: string;
  priceMax?: string;
  totalAreaMin?: string;
  totalAreaMax?: string;
};

export type FilterParams = ApartmentFilterParams | HouseFilterParams;

export type FilterChoiceItem = {
  key: string;
  name: string;
};

export type FilterChoices = {
  name: string;
  key: string;
  choices: FilterChoiceItem[];
  type: 'choices';
};

export type FilterRange = {
  name: string;
  type: 'range';
  min: {
    placeholder: string;
    key: string;
  };
  max: {
    placeholder: string;
    key: string;
  };
};

export type ServerFilterItem = FilterChoices | FilterRange;

export type ApartymentFiltersProps = ServerFilterItem[];
export type HousesFiltersProps = ServerFilterItem[];

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

export type SortOption = {
  name: string;
  value: string;
};

export type {
  CheckboxDropdownProps as checkboxDropdownProps
};