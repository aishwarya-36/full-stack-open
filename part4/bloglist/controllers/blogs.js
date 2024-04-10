const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);
  try {
    blog.likes = blog?.likes || 0;
    if (blog.title === undefined || blog.url === undefined)
      response.status(400).send({ error: "Title/URL is missing" });
    else {
      const savedBlog = await blog.save();
      response.status(201).json(savedBlog);
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (expression) {
    next(expression);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const blog = {
    ...request.body,
    likes: request.body.likes,
  };
  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(blog);
  } catch (expression) {
    next(expression);
  }
});

module.exports = blogsRouter;
