import React from 'react'
import ReactTestRenderer, { act } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from '../features/filters/filtersSlice'
import BlogListScreen from './BlogList'
import { ActivityIndicator, FlatList, Text, TextInput } from 'react-native'

// Mock the RTK Query hook used by BlogList
jest.mock('../services/blogsApi', () => {
  return {
    // Provide types only if needed; runtime returns stub hook
    useGetBlogsQuery: jest.fn(),
  }
})

const mockedUseGetBlogsQuery = require('../services/blogsApi')
  .useGetBlogsQuery as jest.Mock

function makeStore(preloaded?: any) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
    } as any,
    preloadedState: preloaded,
  })
}

function renderWithStore(ui: React.ReactElement, store: any) {
  return ReactTestRenderer.create(<Provider store={store}>{ui}</Provider>)
}

const navigation: any = { navigate: jest.fn() }
const route: any = { name: 'BlogList', params: undefined }

describe('BlogListScreen', () => {
  beforeEach(() => {
    mockedUseGetBlogsQuery.mockReset()
  })

  it('shows loading indicator initially', async () => {
    mockedUseGetBlogsQuery.mockReturnValue({
      isLoading: true,
      isFetching: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    })
    const store = makeStore()
    let tree: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      tree = renderWithStore(
        <BlogListScreen navigation={navigation} route={route} />,
        store,
      )
    })
    const loaders = tree!.root.findAllByType(ActivityIndicator)
    expect(loaders.length).toBeGreaterThan(0)
  })

  it('increments page onEndReached when more data available', async () => {
    const dataPage1 = {
      data: [
        {
          slug: 'a',
          title: 'A',
          sub_title: '',
          content: '',
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString(),
          tags: ['t1'],
          author: {
            _id: '1',
            first_name: 'F',
            last_name: 'L',
            bio: '',
            profile_pic_url: '',
          },
        },
        {
          slug: 'b',
          title: 'B',
          sub_title: '',
          content: '',
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString(),
          tags: ['t2'],
          author: {
            _id: '1',
            first_name: 'F',
            last_name: 'L',
            bio: '',
            profile_pic_url: '',
          },
        },
      ],
      page: 1,
      limit: 2,
      total: 5,
    }
    mockedUseGetBlogsQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: dataPage1,
      refetch: jest.fn(),
    })
    const store = makeStore({
      filters: { selectedTags: [], page: 1, limit: 2 },
    })

    let tree: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      tree = renderWithStore(
        <BlogListScreen navigation={navigation} route={route} />,
        store,
      )
    })

    const list = tree!.root.findByType(FlatList)
    // Simulate reaching the end
    await act(async () => {
      list.props.onEndReached?.()
    })
    expect(store.getState().filters.page).toBe(2)
  })

  it('toggles a tag and resets page', async () => {
    const now = new Date().toISOString()
    const data = {
      data: [
        {
          slug: 'a',
          title: 'A',
          sub_title: '',
          content: '',
          created_date: now,
          modified_date: now,
          tags: ['tech', 'javascript'],
          author: {
            _id: '1',
            first_name: 'F',
            last_name: 'L',
            bio: '',
            profile_pic_url: '',
          },
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    }
    mockedUseGetBlogsQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data,
      refetch: jest.fn(),
    })

    const store = makeStore({
      filters: { selectedTags: [], page: 2, limit: 10 },
    })

    let tree: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      tree = renderWithStore(
        <BlogListScreen navigation={navigation} route={route} />,
        store,
      )
    })

    // Find first Tag pressable by matching its child Text label
    const candidates = tree!.root.findAll(node => {
      if (typeof node.props?.onPress !== 'function') return false
      try {
        const texts = node.findAllByType(Text)
        return texts.some(t => t.props.children === 'tech')
      } catch {
        return false
      }
    })
    expect(candidates.length).toBeGreaterThan(0)
    const techPressable = candidates[0]
    expect(techPressable).toBeTruthy()

    await act(async () => {
      techPressable!.props.onPress()
    })

    expect(store.getState().filters.selectedTags).toEqual(['tech'])
    expect(store.getState().filters.page).toBe(1)
  })

  it('filters list by search query (client-side)', async () => {
    const now = new Date().toISOString()
    const data = {
      data: [
        {
          slug: 'node',
          title: 'Node Basics',
          sub_title: '',
          content: '',
          created_date: now,
          modified_date: now,
          tags: ['backend'],
          author: {
            _id: '1',
            first_name: 'Ada',
            last_name: 'L',
            bio: '',
            profile_pic_url: '',
          },
        },
        {
          slug: 'react',
          title: 'React Guide',
          sub_title: '',
          content: '',
          created_date: now,
          modified_date: now,
          tags: ['frontend'],
          author: {
            _id: '2',
            first_name: 'Grace',
            last_name: 'H',
            bio: '',
            profile_pic_url: '',
          },
        },
      ],
      page: 1,
      limit: 10,
      total: 2,
    }
    mockedUseGetBlogsQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data,
      refetch: jest.fn(),
    })

    const store = makeStore({
      filters: { selectedTags: [], page: 1, limit: 10, search: '' },
    })
    let tree: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      tree = renderWithStore(
        <BlogListScreen navigation={navigation} route={route} />,
        store,
      )
    })

    const listBefore = tree!.root.findByType(FlatList)
    expect(listBefore.props.data.length).toBe(2)

    const input = tree!.root.findByType(TextInput)
    await act(async () => {
      input.props.onChangeText('node')
    })

    const listAfter = tree!.root.findByType(FlatList)
    expect(listAfter.props.data.length).toBe(1)
    expect(listAfter.props.data[0].slug).toBe('node')
  })
})
