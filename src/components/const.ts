enum AppRoute {
    Home = '/',
}
  
const PageNames = {
    Home: { name: 'Главная', key: 'home' },
} as const;

const SORT_OPTIONS = [
    {name: 'Наиболее подходящие', value: 'relevance'},
    {name: 'Сначала дорогие', value: 'price-desc'},
    {name: 'Сначала дешевые', value: 'price-asc'},
    {name: 'Площадь по убыванию', value: 'area-desc'},
    {name: 'Площадь по возрастанию', value: 'area-asc'},
]

export { PageNames, AppRoute, SORT_OPTIONS }