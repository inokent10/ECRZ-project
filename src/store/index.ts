import { configureStore } from "@reduxjs/toolkit";
import { createAPI } from "@/service/api";

import apartmentsSlice from '@/store/slice/apartment-slice/apartment-slice';

const api = createAPI();

const store = configureStore({
    reducer: {
        apartments: apartmentsSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: api,
            },
        })
});

export { store };