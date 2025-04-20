import { FilterParams, ApartmentFilterParams, HouseFilterParams } from "@/types/filter-types/filter-types";
import { PropertyTypeEnum } from "../../const";

const getDynamicLabel = (type: PropertyTypeEnum): string => {
    switch (type) {
      case PropertyTypeEnum.Apartments:
        return 'Кол-во комнат';
      case PropertyTypeEnum.Houses:
        return 'Тип строения';
      case PropertyTypeEnum.Commercial:
        return 'Назначение';
      default:
        return '';
    }
};

const isApartmentFilters = (filters: FilterParams): filters is ApartmentFilterParams => {
  return 'roomType' in filters;
};

const isHouseFilters = (filters: FilterParams): filters is HouseFilterParams => {
  return 'houseType' in filters;
};

const normalizeHouseType = (houseType: string): string => {
  const mapping: Record<string, string> = {
    "Жилой дом": "RESIDENTIAL",
    "Таунхаус": "TOWNHOUSE",
    "Часть дома": "PART_OF_A_HOUSE",
    "Садовый дом": "GARDEN"
  };
  console.log('houseType in func==>', typeof houseType);
  console.log('mapping[houseType] in func==>',mapping[houseType]);
  
  return mapping[houseType] || houseType;
};

const normalizeRoomType = (roomType: string): string => {
  const match = roomType.match(/^(\d+)-к/);
  return match ? match[1] : roomType;
};
  
export {
  getDynamicLabel,
  isHouseFilters,
  isApartmentFilters,
  normalizeRoomType,
  normalizeHouseType
}