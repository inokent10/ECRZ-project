import { configureStore } from "@reduxjs/toolkit";
import { createAPI } from "@/service/api";

import apartmentsSlice from '@/store/slice/apartment-slice/apartment-slice';
import housesSlice from '@/store/slice/houses-slice/houses-slice';

const api = createAPI();

const store = configureStore({
    reducer: {
        apartments: apartmentsSlice,
        houses: housesSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: api,
            },
        })
});

export { store };