import type { Blog } from '../models/blog.model.js'
import type { User } from '../models/user.model.js'

type AuthorShape = Pick<User, 'first_name' | 'last_name' | 'bio' | 'profile_pic_url'> & { _id: string }

export type BlogResponse = {
  title: string
  sub_title: string
  content: string
  slug: string
  tags: string[]
  created_date: string
  modified_date: string
  author: AuthorShape
}

export function mapBlog(doc: any): BlogResponse {
  const blog = doc as Blog & { author?: any; _id: any; createdAt: Date; updatedAt: Date }
  const author = blog.author as any
  const authorOut: AuthorShape = {
    _id: String(author?._id ?? blog.author),
    first_name: author?.first_name ?? '',
    last_name: author?.last_name ?? '',
    bio: author?.bio ?? '',
    profile_pic_url: author?.profile_pic_url ?? '',
  }

  return {
    title: blog.title,
    sub_title: blog.sub_title ?? '',
    content: blog.content,
    slug: blog.slug,
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    created_date: new Date(blog.createdAt).toISOString(),
    modified_date: new Date(blog.updatedAt).toISOString(),
    author: authorOut,
  }
}

