import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => {
              setUsername(target.value);
            }}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.sendLogin({ username, password });
      console.log(user);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("error");
      setErrorMessage(`Wrong username or password`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const logoutForm = () => {
    return (
      <form onSubmit={handleLogout}>
        {user.username} is logged in.
        <button type="submit">logout</button>
      </form>
    );
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log("logging out");
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={handleCreateBlog}>
        <h2>create new</h2>
        <div>
          title:{" "}
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:{" "}
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:{" "}
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    );
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const response = await blogService.createBlog({ title, author, url });
      const newBlogs = await blogService.getAll();
      setErrorMessage(`a new blog ${title} by ${author} added`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setBlogs(newBlogs);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      setErrorMessage("invalid blog creation");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>blogs</h2>
      {user === null ? (
        <div>{loginForm()}</div>
      ) : (
        <div>
          {logoutForm()}
          {createBlogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
