import { store } from '../../store';

export type Store = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;