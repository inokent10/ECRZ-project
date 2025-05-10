import { ApiRoute } from "@/const";
import { HouseEntity, ApiResponse } from "@/types/cards-types/cards-types";
import { HousesFiltersProps } from "@/types/filter-types/filter-types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError, AxiosInstance } from "axios";

export type HousesState = {
  houses: ApiResponse<HouseEntity>;
  filters: HousesFiltersProps | null;
  isLoading: boolean;
  isFiltersLoading: boolean;
  error: string | null;
  filtersError: string | null;
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

interface FetchHousesParams {
  page?: number;
  signal?: AbortSignal;
}

export const fetchHousesAction = createAsyncThunk<
  ApiResponse<HouseEntity>,
  FetchHousesParams | number | void,
  { extra: AxiosInstance; rejectValue: string }
>(
  'cards/fetchHouses',
  async (params, { extra: api, rejectWithValue }) => {
    try {
      let page = 1;
      let signal: AbortSignal | undefined;
      
      if (typeof params === 'number') {
        page = params;
      } else if (params && typeof params === 'object') {
        page = params.page || 1;
        signal = params.signal;
      }
      
      const { data } = await api.get<ApiResponse<HouseEntity>>(
        `${ApiRoute.Houses}?page=${page}&limit=12`,
        { signal }
      );
      
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      
      if (axiosError.name === 'CanceledError' || axiosError.code === 'ERR_CANCELED') {
        throw error;
      }
      
      return rejectWithValue(
        axiosError.response?.data.message || "Ошибка при загрузке домов"
      );
    }
  }
);

export const fetchHouseFiltersAction = createAsyncThunk<
  HousesFiltersProps,
  AbortSignal | undefined,
  { extra: AxiosInstance; rejectValue: string }
>(
  'houses/fetchHouseFilters',
  async (signal, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<HousesFiltersProps>(
        ApiRoute.HousesFilters,
        { signal }
      );
      
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      
      if (axiosError.name === 'CanceledError' || axiosError.code === 'ERR_CANCELED') {
        throw error;
      }
      
      return rejectWithValue(
        axiosError.response?.data.message || "Ошибка при загрузке фильтров для домов"
      );
    }
  }
);

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
        if (action.error.name !== 'CanceledError' && action.error.code !== 'ERR_CANCELED') {
          state.isLoading = false;
          state.error = action.payload || "Неизвестная ошибка";
        }
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
        if (action.error.name !== 'CanceledError' && action.error.code !== 'ERR_CANCELED') {
          state.isFiltersLoading = false;
          state.filtersError = action.payload || "Ошибка при загрузке фильтров для домов";
        }
      })
  }
});

export default housesSlice.reducer;