const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const User = require("../models/user");
const Blog = require("../models/blog");

describe("API: When there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const blogPromises = blogObjects.map((blog) => blog.save());
    await Promise.all(blogPromises);
    await Blog.insertMany(helper.initialBlogs);
  });
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
});

describe("API: When a new blog is added", () => {
  test("succeeds with valid data", async () => {
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

  test("a blog without Title/URL sends a 400 Bad Request", async () => {
    const newBlog1 = {
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
    };
    await api.post("/api/blogs").send(newBlog1).expect(400);

    const newBlog2 = {
      author: "Edsger W. Dijkstra",
      title: "Go To Statement Considered Harmful",
      likes: 5,
    };
    await api.post("/api/blogs").send(newBlog2).expect(400);
  });
});

describe("API: deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(!titles.includes(blogToDelete.title));
  });
});

describe("API: updating of a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes = blogToUpdate.likes + 5;

    const newLikes = blogToUpdate.likes;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);
    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd[0].likes, newLikes);
  });
});

describe.only("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ name: "Matti", username: "root", passwordHash });

    await user.save();
  });

  test.only("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test.only("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
after(async () => {
  await mongoose.connection.close();
});
