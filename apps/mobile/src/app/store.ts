import { configureStore } from '@reduxjs/toolkit'
import { blogsApi } from '../services/blogsApi'
import filtersReducer from '../features/filters/filtersSlice'

export const store = configureStore({
  reducer: {
    [blogsApi.reducerPath]: blogsApi.reducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
