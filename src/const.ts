enum AppRoute {
    Home = '/',
}

enum ApiRoute {
    Apartments = '/apartments',
    ApartmentsFilters = `${Apartments}/filters`,
    Houses = '/houses',
    HousesFilters = `${Houses}/filters`,
}

 enum PropertyTypeEnum {
  Apartments = 'APARTMENTS',
  Houses = 'HOUSES',
  Lands = 'LANDS',
  Commercial = 'COMMERCIAL',
}

const PageNames = {
    Home: { name: 'Главная', key: 'home' },
} as const;

enum SortOptionValue {
    Relevance = 'relevance',
    PriceDesc = 'price-desc',
    PriceAsc = 'price-asc',
    AreaDesc = 'area-desc',
    AreaAsc = 'area-asc'
  }

const SORT_OPTIONS = [
    {name: 'Наиболее подходящие', value: SortOptionValue.Relevance},
    {name: 'Сначала дорогие', value: SortOptionValue.PriceDesc},
    {name: 'Сначала дешевые', value: SortOptionValue.PriceAsc},
    {name: 'Площадь по убыванию', value: SortOptionValue.AreaDesc},
    {name: 'Площадь по возрастанию', value: SortOptionValue.AreaAsc},
]

const TYPE_DISPLAY_NAMES: Record<PropertyTypeEnum, string> = {
  [PropertyTypeEnum.Apartments]: 'Квартира',
  [PropertyTypeEnum.Houses]: 'Дома',
  [PropertyTypeEnum.Lands]: 'Участки',
  [PropertyTypeEnum.Commercial]: 'Коммерческая',
};

const TYPE_SHOW_NAMES: Record<PropertyTypeEnum, string> = {
  [PropertyTypeEnum.Apartments]: 'Квартиру',
  [PropertyTypeEnum.Houses]: 'Дом',
  [PropertyTypeEnum.Lands]: 'Участки',
  [PropertyTypeEnum.Commercial]: 'Коммерческую землю',
};

   const TYPE_OPTIONS = Object.values(TYPE_DISPLAY_NAMES);
  
   const DYNAMIC_FIELD_OPTIONS: Record<PropertyTypeEnum, string[]> = {
     [PropertyTypeEnum.Apartments]: ['1-к. квартиры', '2-к. квартиры', '3-к. квартиры', '4-к. квартиры', 'Комнаты в квартирах'],
     [PropertyTypeEnum.Houses]: ['Дом', 'Таунхаус', 'Часть дома', 'Дача'],
     [PropertyTypeEnum.Lands]: ['Участки до 10 сот.', 'Участки до 20 сот.', 'Участки ИЖС', 'Участки Промназначения', 'Все объекты'],
     [PropertyTypeEnum.Commercial]: ['Офис', 'Склады', 'Свободное назначение', 'Все объекты'],
   };

const REG_ONLY_NUMBERS = /[^0-9]/g;

const DEFAULT_IMAGES = {
  apartment: [
    '/public/image/huy-nguyen-AB-q9lwCVv8-unsplash.jpg',
    '/public/image/modern-kitchen-interior-design.jpg',
    '/public/image/skyscraper-8173578.jpg',
  ],
  house: [
    '/public/image/s-tsuchiya-f41xZ19S9dY-unsplash.jpg',
    '/public/image/3d-room-interior-with-classic-design-furniture.jpg',
    '/public/image/tranquil-space-with-plants.jpg',
  ]
};

export {
    PageNames,
    AppRoute,
    ApiRoute,
    SORT_OPTIONS,
    DYNAMIC_FIELD_OPTIONS,
    TYPE_OPTIONS,
    PropertyTypeEnum,
    TYPE_DISPLAY_NAMES,
    REG_ONLY_NUMBERS,
    DEFAULT_IMAGES,
    SortOptionValue,
    TYPE_SHOW_NAMES
}