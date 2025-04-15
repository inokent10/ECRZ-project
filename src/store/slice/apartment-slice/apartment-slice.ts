import { ApiRoute } from "@/const";
import { ApartmentEntity, ApiResponse } from "@/types/cards-types/cards-types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError, AxiosInstance } from "axios";

export type ApartmentState = {
    apartments: ApiResponse<ApartmentEntity>,
    isLoading: boolean,
    error: string | null,
}

const initialState: ApartmentState = {
    apartments: {
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 12,
        entities: [],
      },
    isLoading: false,
    error: null,
} 

export const fetchApartmentsAction = createAsyncThunk<
    ApiResponse<ApartmentEntity>,
    void,
    { extra: AxiosInstance; rejectValue: string }
    >(
        'cards/fetchApartments',
        async (_, { extra: api, rejectWithValue }) => {
            try {
                const { data } = await api.get<ApiResponse<ApartmentEntity>>(ApiRoute.Apartments);
                
                return data;
            } catch (error) {
                const axiosError = error as AxiosError<{ message: string }>;
                return rejectWithValue(
                  axiosError.response?.data.message || "Ошибка при загрузке квартир"
                );
              }
        }
)

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
    }
})

export default apartmentsSlice.reducer;