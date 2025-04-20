import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ApiResponse, HouseEntity } from "@/types/cards-types/cards-types"
import { ApiRoute } from "@/const"
import { AxiosInstance, AxiosError } from "axios"
import { HousesFiltersProps } from "@/types/filter-types/filter-types"
  
  export type HousesState = {
    houses: ApiResponse<HouseEntity>,
    filters: HousesFiltersProps | null,
    isLoading: boolean,
    isFiltersLoading: boolean,
    error: string | null,
    filtersError: string | null,
  }
  
  const initialState: HousesState = {
    houses: {
      totalPages: 0,
      totalItems: 0,
      currentPage: 1,
      itemsPerPage: 12,
      entities: [],
    },
    filters: null,
    isLoading: false,
    isFiltersLoading: false,
    error: null,
    filtersError: null,
  }

export const fetchHousesAction = createAsyncThunk<
    ApiResponse<HouseEntity>,
    number | void,
    { extra: AxiosInstance; rejectValue: string }
    >(
        'cards/fetchApartments',
        async (page = 1, { extra: api, rejectWithValue }) => {
            try {
              const { data } = await api.get<ApiResponse<HouseEntity>>(
                  `${ApiRoute.Houses}?page=${page}&limit=12`
                );
                
                return data;
            } catch (error) {
                const axiosError = error as AxiosError<{ message: string }>;
                return rejectWithValue(
                  axiosError.response?.data.message || "Ошибка при загрузке квартир"
                );
              }
        }
)

export const fetchHouseFiltersAction = createAsyncThunk<
HousesFiltersProps,
  void,
  { extra: AxiosInstance; rejectValue: string }
>(
  'houses/fetchHouseFilters',
  async (_, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<HousesFiltersProps>(ApiRoute.HousesFilters);
      
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Ошибка при загрузке фильтров для домов"
      );
    }
  }
)

const housesSlice = createSlice({
    name: 'houses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHousesAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHousesAction.fulfilled, (state, action) => {
                state.houses = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchHousesAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Неизвестная ошибка";
            })
        

            .addCase(fetchHouseFiltersAction.pending, (state) => {
                state.isFiltersLoading = true;
                state.filtersError = null;
              })
              .addCase(fetchHouseFiltersAction.fulfilled, (state, action) => {
                state.filters = action.payload;
                state.isFiltersLoading = false;
                state.filtersError = null;
              })
              .addCase(fetchHouseFiltersAction.rejected, (state, action) => {
                state.isFiltersLoading = false;
                state.filtersError = action.payload || "Ошибка при загрузке фильтров для домов";
              })
    }
})

export default housesSlice.reducer;