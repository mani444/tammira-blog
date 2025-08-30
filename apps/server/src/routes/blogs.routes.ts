import { Router } from 'express'
import { listBlogs, updateBlogById } from '../controllers/blog.controller.js'

const router = Router()

router.get('/', listBlogs)
router.put('/:id', updateBlogById)

export default router

