import { Types } from "mongoose";
import { slugify } from "../utils/slugify.js";

export const users = [
  {
    _id: new Types.ObjectId(),
    first_name: "John",
    last_name: "Doe",
    bio: "Software engineer and writer.",
    profile_pic_url: "https://example.com/john_doe.jpg",
  },
  {
    _id: new Types.ObjectId(),
    first_name: "Jane",
    last_name: "Smith",
    bio: "Tech blogger and avid reader.",
    profile_pic_url: "https://example.com/jane_smith.jpg",
  },
] as const;

const [u1, u2] = users;

export const blogs = [
  {
    title: "Sample Blog Title",
    sub_title: "Sample Blog Subtitle",
    content: "This is the blog content...",
    tags: ["tech", "javascript"],
    author: u1._id,
  },
  {
    title: "Getting Started with Node.js",
    sub_title: "A quick primer",
    content: "Node.js lets you run JS on the server...",
    tags: ["tech", "node"],
    author: u2._id,
  },
  {
    title: "MongoDB Tips for Beginners",
    sub_title: "Indexes, schemas, and more",
    content: "Start with a clear schema and add indexes...",
    tags: ["tech", "mongodb"],
    author: u1._id,
  },
  {
    title: "Understanding Async/Await",
    sub_title: "Write async code clearly",
    content: "Async/await simplifies promise-based code...",
    tags: ["javascript"],
    author: u2._id,
  },
  {
    title: "Understanding Async",
    sub_title: "Write async code clearly",
    content: "Async/await simplifies promise-based code...",
    tags: ["javascript"],
    author: u2._id,
  },
  {
    title: "Understanding Await",
    sub_title: "Write async code clearly",
    content: "Async/await simplifies promise-based code...",
    tags: ["javascript"],
    author: u2._id,
  },
  {
    title: "Understanding Async/Await Beginners",
    sub_title: "Write async code clearly",
    content: "Async/await simplifies promise-based code...",
    tags: ["javascript"],
    author: u2._id,
  },
  {
    title: "Understanding Async/Await for Beginners",
    sub_title: "Write async code clearly",
    content: "Async/await simplifies promise-based code...",
    tags: ["javascript"],
    author: u2._id,
  },
  {
    title: "Understanding Title",
    sub_title: "Write async code clearly",
    content: "Async/await simplifies promise-based code...",
    tags: ["javascript"],
    author: u2._id,
  },
].map((b) => ({ ...b, slug: slugify(b.title) }));
