const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;
  const blog = new Blog({
    ...body,
    user: user.id,
  });
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  blog.likes = blog?.likes || 0;
  if (blog.title === undefined || blog.url === undefined)
    response.status(400).send({ error: "Title/URL is missing" });
  else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!request.token) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  if (!blog)
    response.status(404).json({ error: "Invalid Blog Id/Blog does not exist" });
  if (blog.user.toString() === request.user.id) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    return response.status(401).json({ error: "Unauthorized access" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = {
    ...request.body,
    likes: request.body.likes,
  };

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(blog);
});

module.exports = blogsRouter;
