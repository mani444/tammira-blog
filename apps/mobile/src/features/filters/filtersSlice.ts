import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FiltersState = {
  selectedTags: string[]
  page: number
  limit: number
  search: string
}

const initialState: FiltersState = {
  selectedTags: [],
  page: 1,
  limit: 10,
  search: '',
}

function normalizeTags(tags: string[]): string[] {
  const uniq = Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean)))
  uniq.sort()
  return uniq
}

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTags(state, action: PayloadAction<string[]>) {
      state.selectedTags = normalizeTags(action.payload)
      state.page = 1
    },
    clearTags(state) {
      state.selectedTags = []
      state.page = 1
    },
    nextPage(state) {
      state.page += 1
    },
    resetPagination(state) {
      state.page = 1
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.max(1, action.payload)
      state.page = 1
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    clearSearch(state) {
      state.search = ''
    },
  },
})

export const { setTags, clearTags, nextPage, resetPagination, setLimit, setSearch, clearSearch } = filtersSlice.actions
export default filtersSlice.reducer
