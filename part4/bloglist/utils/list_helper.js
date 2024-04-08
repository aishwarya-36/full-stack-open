const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  } else {
    return blogs.reduce((sum, item) => sum + item.likes, 0);
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    return blogs.reduce(function (prev, current) {
      return prev && prev.likes > current.likes ? prev : current;
    });
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
