import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiBaseUrl } from '../lib/config'

export type Author = {
  _id: string
  first_name: string
  last_name: string
  bio: string
  profile_pic_url: string
}

export type Blog = {
  title: string
  sub_title: string
  content: string
  slug: string
  tags: string[]
  created_date: string
  modified_date: string
  author: Author
}

export type ListBlogsResponse = {
  data: Blog[]
  page: number
  limit: number
  total: number
}

export type ListBlogsArgs = {
  page?: number
  limit?: number
  tags?: string[]
}

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({ baseUrl: getApiBaseUrl() }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    getBlogs: builder.query<ListBlogsResponse, ListBlogsArgs | void>({
      query: (args) => {
        const page = args?.page ?? 1
        const limit = args?.limit ?? 10
        const tagsParam = args?.tags && args.tags.length ? { tags: args.tags.join(',') } : {}
        return {
          url: '/api/blogs',
          params: { page, limit, ...tagsParam },
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((b) => ({ type: 'Blogs' as const, id: b.slug })),
              { type: 'Blogs' as const, id: 'LIST' },
            ]
          : [{ type: 'Blogs' as const, id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),
  }),
})

export const { useGetBlogsQuery } = blogsApi

