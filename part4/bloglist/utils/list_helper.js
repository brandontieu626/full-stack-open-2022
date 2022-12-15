const lodash = require("lodash");

const dummy = (blog) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;

  for (let i = 0; i < blogs.length; i++) {
    sum += blogs[i].likes;
  }

  return sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return NaN;
  }

  const favorite = blogs.reduce((larg, curr) => {
    return curr.likes > larg.likes ? curr : larg;
  }, blogs[0]);

  return favorite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCount = lodash.countBy(blogs, "author");
  console.log(authorCount);
  const topAuthor = Object.keys(authorCount).reduce((a, b) => {
    return authorCount[a] > authorCount[b] ? a : b;
  });

  return {
    author: topAuthor,
    blogs: authorCount[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesCount = lodash(blogs)
    .groupBy("author")
    .map((objs, key) => ({
      author: key,
      likes: lodash.sumBy(objs, "likes"),
    }))
    .value();

  return likesCount.reduce((a, b) => {
    return a.likes > b.likes ? a : b;
  });
};

module.exports = { dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs };
