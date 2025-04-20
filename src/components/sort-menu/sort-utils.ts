import { SortOptionValue } from "@/const";
import { ApiResponse, CardsEntity } from "@/types/cards-types/cards-types";

export function sortProperties<T extends CardsEntity>(
  response: ApiResponse<T>, 
  sortValue: string
): ApiResponse<T> {

  if (!response?.entities || !Array.isArray(response.entities)) {
    console.error('Invalid response format', response);
    return response;
}
  
  const sortedResponse = { ...response };
  
  const sortedEntities = [...response.entities];
  
  switch (sortValue) {
    case SortOptionValue.PriceDesc:
      sortedEntities.sort((a, b) => b.priceUsd - a.priceUsd);
      break;
      
    case SortOptionValue.PriceAsc:
      sortedEntities.sort((a, b) => a.priceUsd - b.priceUsd);
      break;
      
    case SortOptionValue.AreaDesc:
      sortedEntities.sort((a, b) => b.totalArea - a.totalArea);
      break;
      
    case SortOptionValue.AreaAsc:
      sortedEntities.sort((a, b) => a.totalArea - b.totalArea);
      break;
      
    case SortOptionValue.Relevance:
    default:
      break;
  }
  
  sortedResponse.entities = sortedEntities;
  
  return sortedResponse;
}