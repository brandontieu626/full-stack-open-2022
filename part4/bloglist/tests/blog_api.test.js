const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var testToken;
beforeEach(async () => {
  await Blog.deleteMany({});

  await User.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
  const passwordHash = await bcrypt.hash(helper.initialUsers[0].password, 10);
  const user = await new User({
    username: helper.initialUsers[0].username,
    passwordHash,
  }).save();

  const userForToken = {
    username: helper.initialUsers[0].username,
    id: user.id,
  };

  return (testToken = jwt.sign(userForToken, process.env.SECRET));
});

describe("Adding of blogs test suite", () => {
  test("correctly adds a new blog ", async () => {
    const newBlog = {
      title: "Zhong Guo Wo Xihuan Bing Chiling",
      author: "John Cena",
      url: "www.swag.com",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("Zhong Guo Wo Xihuan Bing Chiling");
  });

  test("missing likes property defaults to 0", async () => {
    const newBlog = {
      title: "Zhong Guo Wo Xihuan Bing Chiling",
      author: "John Cena",
      url: "www.swag.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const likes = blogsAtEnd.map((blog) => blog.likes);
    expect(likes).toContain(0);
  });

  test("missing title or missing url", async () => {
    const newBlog = {
      author: "John Cena",
      url: "www.swag.com",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${testToken}`)
      .send(newBlog)
      .expect(400);
  });
});

describe("Getting of blogs test suite", () => {
  test("correct count of notes returned", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // console.log(response.body);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier is named id", async () => {
    const blogs = await helper.blogsInDb();
    const blogKeys = Object.keys(blogs[0]);

    console.log(blogKeys);
    expect(blogKeys).toContain("id");
    expect(blogKeys).not.toContain("_id");
  });
});

describe("Deleting Blogs, Updating, and Authorization", () => {
  test("deleting a blog", async () => {
    const newBlog = {
      title: "Zhong Guo Wo Xihuan Bing Chiling",
      author: "John Cena",
      url: "www.swag.com",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[2];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${testToken}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1 - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("updating a blog ", async () => {
    const newBlog = {
      title: "Zhong Guo Wo Xihuan Bing Chiling",
      author: "John Cena",
      url: "www.swag.com",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[2];

    const updatedBlog = {
      likes: 400,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `bearer ${testToken}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const likes = blogsAtEnd.map((blog) => blog.likes);
    expect(likes).toContain(updatedBlog.likes);
  });

  test("failed blog addition with no authorization ", async () => {
    const newBlog = {
      title: "Zhong Guo Wo Xihuan Bing Chiling",
      author: "John Cena",
      url: "www.swag.com",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain("Zhong Guo Wo Xihuan Bing Chiling");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
