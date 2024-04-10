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

  after(async () => {
    await mongoose.connection.close();
  });
});
