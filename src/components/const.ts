enum AppRoute {
    Home = '/',
}

enum PropertyTypeEnum {
    Apartments = 'Apartments',
    Houses = 'Houses',
    Plots = 'Plots',
    Commercial = 'Commercial',
    JuridicalInquiry = 'JuridicalInquiry'
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
    [PropertyTypeEnum.Plots]: 'Участки',
    [PropertyTypeEnum.Commercial]: 'Коммерческая',
    [PropertyTypeEnum.JuridicalInquiry]: 'Юр. запросы'
  };

   const TYPE_OPTIONS = Object.values(TYPE_DISPLAY_NAMES);
  
   const DYNAMIC_FIELD_OPTIONS = {
    [PropertyTypeEnum.Apartments]: ['1-к. квартиры', '2-к. квартиры', '3-к. квартиры', '4-к. квартиры', 'Комнаты в квартирах'],
    [PropertyTypeEnum.Houses]: ['Дом', 'Таунхаус', 'Часть дома', 'Дача'],
    [PropertyTypeEnum.Plots]: ['Участки до 10 сот.', 'Участки до 20 сот.', 'Участки ИЖС', 'Участки Промназначения', 'Все объекты'],
    [PropertyTypeEnum.Commercial]: ['Офис', 'Склады', 'Свободное назначение', 'Все объекты'],
    [PropertyTypeEnum.JuridicalInquiry]: ['Продажа недвижимости', 'Помощь в оформлении кредита', 'Оформление технической документации', 'Вывод в нежилой фонд'],
   };

const REG_ONLY_NUMBERS = /[^0-9]/g;

export {
    PageNames,
    AppRoute,
    SORT_OPTIONS,
    DYNAMIC_FIELD_OPTIONS,
    TYPE_OPTIONS,
    PropertyTypeEnum,
    TYPE_DISPLAY_NAMES,
    REG_ONLY_NUMBERS
}