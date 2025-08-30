import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose'
import { slugify } from '../utils/slugify.js'

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    sub_title: { type: String, default: '', trim: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tags: { type: [String], default: [] },
    author: { type: Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    collection: 'blog',
  }
)

// Derived fields / indexes
BlogSchema.index({ createdAt: -1 })
BlogSchema.index({ tags: 1 })

// Maintain slug based on title if not provided or if title changed
BlogSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    const base = slugify(this.title)
    this.slug = base
  }
  next()
})

export type Blog = InferSchemaType<typeof BlogSchema>
export type BlogModel = Model<Blog>

export const Blog = model<Blog, BlogModel>('Blog', BlogSchema)

