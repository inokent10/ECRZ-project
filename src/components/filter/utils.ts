import { PropertyTypeEnum } from "components/const";

const getDynamicLabel = (type: PropertyTypeEnum): string => {
    switch (type) {
      case PropertyTypeEnum.Apartments:
        return 'Кол-во комнат';
      case PropertyTypeEnum.Houses:
        return 'Тип строения';
      case PropertyTypeEnum.Plots:
        return 'Тип участка';
      case PropertyTypeEnum.Commercial:
        return 'Назначение';
      case PropertyTypeEnum.JuridicalInquiry:
        return 'Цель запроса';
      default:
        return '';
    }
};
  
export { getDynamicLabel }