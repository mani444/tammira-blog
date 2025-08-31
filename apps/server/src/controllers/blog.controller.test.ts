import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listBlogs, updateBlogById } from './blog.controller'
import { Blog } from '../models/blog.model'
import { BadRequestError } from '../errors/http-error'

// Helper: build chainable Mongoose-like query for Blog.find()
function buildFindChain(data: any[]) {
  let _skip = 0
  let _limit: number | undefined
  const chain = {
    sort: (_arg: any) => chain,
    skip: (n: number) => {
      _skip = n || 0
      return chain
    },
    limit: (n: number) => {
      _limit = n
      return chain
    },
    populate: (_path: string, _sel?: string) => chain,
    lean: async () => {
      const start = _skip || 0
      const end = typeof _limit === 'number' ? start + _limit : undefined
      return data.slice(start, end)
    },
  }
  return chain as any
}

function applyTagFilter(items: any[], filter: any) {
  if (!filter || !filter.tags) return items
  const cond = filter.tags
  if (cond && cond.$all && Array.isArray(cond.$all)) {
    return items.filter((b) => cond.$all.every((t: string) => b.tags?.includes(t)))
  }
  return items
}

function mockReqRes(query: any = {}, params: any = {}, body: any = {}) {
  const req: any = { query, params, body }
  let jsonPayload: any
  let statusCode: number | undefined
  const res: any = {
    status: (code: number) => {
      statusCode = code
      return res
    },
    json: (payload: any) => {
      jsonPayload = payload
      return res
    },
  }
  const next = vi.fn()
  return { req, res, next, get json() { return jsonPayload }, get status() { return statusCode } }
}

describe('blog.controller unit', () => {
  const baseItems = Array.from({ length: 5 }).map((_, i) => ({
    title: `Post ${i + 1}`,
    sub_title: `Sub ${i + 1}`,
    content: `Content ${i + 1}`,
    slug: `post-${i + 1}`,
    tags: i % 2 === 0 ? ['tech', 'javascript'] : ['misc'],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    author: {
      _id: '507f1f77bcf86cd799439011',
      first_name: 'John',
      last_name: 'Doe',
      bio: 'B',
      profile_pic_url: 'U',
    },
  }))

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('listBlogs paginates', async () => {
    vi.spyOn(Blog, 'find').mockImplementation((filter?: any) => {
      const filtered = applyTagFilter(baseItems as any, filter)
      return buildFindChain(filtered)
    })
    vi.spyOn(Blog, 'countDocuments').mockResolvedValue(baseItems.length as any)

    const ctx = mockReqRes({ page: '2', limit: '2' })
    await listBlogs(ctx.req, ctx.res, ctx.next)

    expect(ctx.next).not.toHaveBeenCalled()
    expect(ctx.json).toBeDefined()
    expect(ctx.json.page).toBe(2)
    expect(ctx.json.limit).toBe(2)
    expect(ctx.json.total).toBe(5)
    expect(ctx.json.data).toHaveLength(2)
  })

  it('listBlogs filters by tags ($all)', async () => {
    const findSpy = vi.spyOn(Blog, 'find').mockImplementation((filter?: any) => {
      const filtered = applyTagFilter(baseItems as any, filter)
      return buildFindChain(filtered)
    })
    vi.spyOn(Blog, 'countDocuments').mockImplementation((filter?: any) => {
      const filtered = applyTagFilter(baseItems as any, filter)
      return Promise.resolve(filtered.length) as any
    })

    const ctx = mockReqRes({ tags: 'tech,javascript', page: '1', limit: '10' })
    await listBlogs(ctx.req, ctx.res, ctx.next)
    expect(ctx.next).not.toHaveBeenCalled()
    expect(findSpy).toHaveBeenCalledWith({ tags: { $all: ['tech', 'javascript'] } })
    expect(ctx.json.total).toBe(baseItems.filter((b) => b.tags.includes('tech') && b.tags.includes('javascript')).length)
  })

  it('updateBlogById updates fields and returns mapped object', async () => {
    const now = new Date('2025-01-01T00:00:00.000Z')
    const doc: any = {
      _id: '1',
      title: 'Old Title',
      sub_title: 'S',
      content: 'C',
      slug: 'old-title',
      tags: ['a'],
      createdAt: now,
      updatedAt: now,
      author: { _id: '507f1f77bcf86cd799439011', first_name: 'John', last_name: 'Doe', bio: 'B', profile_pic_url: 'U' },
      save: vi.fn(async function (this: any) {
        const normalized = String(this.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        this.slug = normalized
        return this
      }),
      populate: vi.fn(async function () { return this }),
      toObject: function () { return this },
    }
    vi.spyOn(Blog, 'findById').mockResolvedValue(doc)

    const ctx = mockReqRes({}, { id: '1' }, { title: 'New Title', tags: ['tech'] })
    await updateBlogById(ctx.req, ctx.res, ctx.next)

    expect(ctx.next).not.toHaveBeenCalled()
    expect(ctx.json).toMatchObject({ title: 'New Title', slug: 'new-title', tags: ['tech'], author: { first_name: 'John' } })
  })

  it('updateBlogById passes Duplicate slug error to next', async () => {
    const now = new Date('2025-01-01T00:00:00.000Z')
    const dupDoc: any = {
      _id: '2',
      title: 'T',
      sub_title: 'S',
      content: 'C',
      slug: 't',
      tags: [],
      createdAt: now,
      updatedAt: now,
      author: '507f1f77bcf86cd799439011',
      save: vi.fn(async function () {
        const err: any = new Error('duplicate key')
        err.code = 11000
        throw err
      }),
      populate: vi.fn(async function () { return this }),
      toObject: function () { return this },
    }
    vi.spyOn(Blog, 'findById').mockResolvedValue(dupDoc)

    const ctx = mockReqRes({}, { id: '2' }, { title: 'Conflicting' })
    await updateBlogById(ctx.req, ctx.res, ctx.next)
    expect(ctx.json).toBeUndefined()
    expect(ctx.next).toHaveBeenCalled()
    const errArg = ctx.next.mock.calls[0][0]
    expect(errArg).toBeInstanceOf(BadRequestError)
    expect(errArg.message).toBe('Duplicate slug')
  })
})
