import { describe, it, expect } from 'vitest'
import { mapBlog } from './blog.mapper.js'

describe('mapBlog', () => {
  it('maps db fields to API shape', () => {
    const now = new Date()
    const input = {
      title: 'T',
      sub_title: 'S',
      content: 'C',
      slug: 't',
      tags: ['a'],
      createdAt: now,
      updatedAt: now,
      author: {
        _id: '507f1f77bcf86cd799439011',
        first_name: 'John',
        last_name: 'Doe',
        bio: 'B',
        profile_pic_url: 'U',
      },
    }
    const out = mapBlog(input)
    expect(out).toMatchObject({
      title: 'T',
      sub_title: 'S',
      content: 'C',
      slug: 't',
      tags: ['a'],
      author: {
        _id: '507f1f77bcf86cd799439011',
        first_name: 'John',
        last_name: 'Doe',
        bio: 'B',
        profile_pic_url: 'U',
      },
    })
    expect(out.created_date).toBe(now.toISOString())
    expect(out.modified_date).toBe(now.toISOString())
  })
})

