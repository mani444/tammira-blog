import type { Request, Response, NextFunction } from 'express'
import { Blog } from '../models/blog.model.js'
import { mapBlog } from '../mappers/blog.mapper.js'
import { BadRequestError, NotFoundError } from '../errors/http-error.js'

function parseTags(input: unknown): string[] | undefined {
  if (!input) return undefined
  const parts = Array.isArray(input) ? (input as string[]) : [String(input)]
  const tags = parts
    .flatMap((s) => s.split(','))
    .map((s) => s.trim())
    .filter(Boolean)
  return tags.length ? Array.from(new Set(tags)) : undefined
}

export async function listBlogs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1) || 1)
    const limit = Math.max(
      1,
      Math.min(100, Number(req.query.limit ?? 10) || 10),
    )
    const tags = parseTags(req.query.tags)

    const filter: Record<string, unknown> = {}
    if (tags && tags.length) {
      filter.tags = { $all: tags }
    }

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'first_name last_name bio profile_pic_url')
        .lean(),
      Blog.countDocuments(filter),
    ])

    const data = items.map(mapBlog)
    res.json({ data, page, limit, total })
  } catch (err) {
    next(err)
  }
}

export async function updateBlogById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params
    if (!id) throw new BadRequestError('Blog id is required')

    const payload = req.body ?? {}
    const allowed = ['title', 'sub_title', 'content', 'tags'] as const
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in payload) updates[key] = payload[key]
    }
    if (updates.tags && !Array.isArray(updates.tags)) {
      throw new BadRequestError('tags must be an array of strings')
    }

    let blog = null
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id)
    } else {
      blog = await Blog.findOne({ slug: id })
    }

    if (!blog) throw new NotFoundError('Blog not found')

    for (const [k, v] of Object.entries(updates)) {
      ;(blog as any)[k] = v
    }

    await blog.save()
    await blog.populate('author', 'first_name last_name bio profile_pic_url')

    res.json(mapBlog(blog.toObject()))
  } catch (err: any) {
    if (err?.code === 11000) {
      next(new BadRequestError('Duplicate slug'))
      return
    }
    next(err)
  }
}
