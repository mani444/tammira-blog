import reducer, { setTags, clearTags, nextPage, resetPagination, setLimit, type FiltersState } from './filtersSlice'

describe('filtersSlice', () => {
  const base: FiltersState = { selectedTags: [], page: 1, limit: 10 }

  it('setTags normalizes and resets page', () => {
    const prev: FiltersState = { ...base, page: 3 }
    const next = reducer(prev, setTags([' tech ', 'javascript', 'tech']))
    expect(next.selectedTags).toEqual(['javascript', 'tech'])
    expect(next.page).toBe(1)
  })

  it('clearTags empties and resets page', () => {
    const prev: FiltersState = { selectedTags: ['a', 'b'], page: 2, limit: 10 }
    const next = reducer(prev, clearTags())
    expect(next.selectedTags).toEqual([])
    expect(next.page).toBe(1)
  })

  it('nextPage increments', () => {
    const prev: FiltersState = { ...base, page: 1 }
    const next = reducer(prev, nextPage())
    expect(next.page).toBe(2)
  })

  it('setLimit updates and resets page', () => {
    const prev: FiltersState = { ...base, page: 5 }
    const next = reducer(prev, setLimit(25))
    expect(next.limit).toBe(25)
    expect(next.page).toBe(1)
  })

  it('setLimit enforces minimum 1', () => {
    const prev: FiltersState = { ...base, page: 2 }
    const next = reducer(prev, setLimit(0))
    expect(next.limit).toBe(1)
    expect(next.page).toBe(1)
  })
})

