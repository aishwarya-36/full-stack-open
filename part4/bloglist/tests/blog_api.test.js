const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const blogPromises = blogObjects.map((blog) => blog.save());
  await Promise.all(blogPromises);
});

describe("API", () => {
  test("correct amount of blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const getBlogsInDb = await helper.blogsInDb();
    assert.strictEqual(getBlogsInDb.length, helper.initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const blogs = await response.body;

    //Count the number of blogs with "_id"
    const _idCount = blogs.reduce(
      (count, blog) => (blog._id ? count + 1 : count),
      0
    );

    //Count the number of blogs with "id"
    const idCount = blogs.reduce(
      (count, blog) => (blog.id ? count + 1 : count),
      0
    );

    // Check if "_id" count is 0 and "id" count equals the total no. of blogs
    assert.strictEqual(_idCount, 0);
    assert.strictEqual(idCount, helper.initialBlogs.length);
  });

  test("a valid blog is added", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const getBlogs = await helper.blogsInDb();
    assert.strictEqual(getBlogs.length, helper.initialBlogs.length + 1);

    const titles = getBlogs.map((b) => b.title);
    assert(titles.includes("Go To Statement Considered Harmful"));
  });

  test("a blog without likes property defaults to value 0", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    //Check if likes with default 0 value has been added
    const getBlogs = await helper.blogsInDb();
    assert.strictEqual(getBlogs[getBlogs.length - 1].likes, 0);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});