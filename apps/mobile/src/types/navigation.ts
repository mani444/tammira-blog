import type { Blog } from '../services/blogsApi'

export type RootStackParamList = {
  BlogList: undefined
  BlogDetails: { blog: Blog }
}
