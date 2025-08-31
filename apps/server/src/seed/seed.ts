import { connectMongo, disconnectMongo } from '../db/mongoose.js'
import { User } from '../models/user.model.js'
import { Blog } from '../models/blog.model.js'
import { users, blogs } from './data.js'

async function main() {
  await connectMongo()

  await Blog.deleteMany({})
  await User.deleteMany({})

  await User.insertMany(users)
  await Blog.insertMany(
    blogs.map((b) => ({
      ...b,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )

  const counts = {
    users: await User.countDocuments(),
    blogs: await Blog.countDocuments(),
  }
  console.log('Seeded:', counts)
}

main()
  .catch((err) => {
    console.error('Seed failed', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectMongo()
  })

