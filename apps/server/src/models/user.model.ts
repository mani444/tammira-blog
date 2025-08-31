import { Schema, model, type Model, type InferSchemaType } from 'mongoose'

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    bio: { type: String, default: '', trim: true },
    profile_pic_url: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'user',
  }
)

// Index to speed search/sort by name
UserSchema.index({ last_name: 1, first_name: 1 })

export type User = InferSchemaType<typeof UserSchema>
export type UserModel = Model<User>

export const User = model<User, UserModel>('User', UserSchema)

