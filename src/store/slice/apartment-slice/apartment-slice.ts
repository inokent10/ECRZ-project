import { ApiRoute } from "@/const";
import { ApartmentEntity, ApiResponse } from "@/types/cards-types/cards-types";
import { ApartymentFiltersProps } from "@/types/filter-types/filter-types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError, AxiosInstance } from "axios";

  export type ApartmentsState = {
    apartments: ApiResponse<ApartmentEntity>;
    filters: ApartymentFiltersProps | null;
    isLoading: boolean;
    isFiltersLoading: boolean;
    error: string | null;
    filtersError: string | null;
  }
  
  const initialState: ApartmentsState = {
    apartments: {
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

export const fetchApartmentsAction = createAsyncThunk<
    ApiResponse<ApartmentEntity>,
    number | void,
    { extra: AxiosInstance; rejectValue: string }
    >(
        'cards/fetchApartments',
        async (page = 1, { extra: api, rejectWithValue }) => {
            try {
              const { data } = await api.get<ApiResponse<ApartmentEntity>>(
                  `${ApiRoute.Apartments}?page=${page}&limit=12`
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

export const fetchApartmentFiltersAction = createAsyncThunk<
ApartymentFiltersProps,
  void,
  { extra: AxiosInstance; rejectValue: string }
>(
  'apartments/fetchApartmentFilters',
  async (_, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<ApartymentFiltersProps>(ApiRoute.ApartmentsFilters);
      
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Ошибка при загрузке фильтров для квартир"
      );
    }
  }
);

const apartmentsSlice = createSlice({
    name: 'apartments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApartmentsAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchApartmentsAction.fulfilled, (state, action) => {
                state.apartments = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchApartmentsAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Неизвестная ошибка";
            })
        
            .addCase(fetchApartmentFiltersAction.pending, (state) => {
                state.isFiltersLoading = true;
                state.filtersError = null;
              })
              .addCase(fetchApartmentFiltersAction.fulfilled, (state, action) => {
                state.filters = action.payload;
                state.isFiltersLoading = false;
                state.filtersError = null;
              })
              .addCase(fetchApartmentFiltersAction.rejected, (state, action) => {
                state.isFiltersLoading = false;
                state.filtersError = action.payload || "Ошибка при загрузке фильтров для квартир";
              })
    }
})

export default apartmentsSlice.reducer;