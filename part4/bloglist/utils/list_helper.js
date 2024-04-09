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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    // Create a simplified object with author name and likes
    const blogStats = blogs.map((blog) => ({
      author: blog.author,
      likes: blog.likes,
    }));

    //Group them based on author names
    const grouped = Object.groupBy(blogStats, (blog) => blog.author);

    //Count the number of blogs by each author
    const blogCount = Object.keys(grouped).map((item) => ({
      author: item,
      blogs: grouped[item].length,
    }));

    //Determine the one with most number of blogs
    return blogCount.reduce(function (prev, current) {
      return prev && prev > current ? prev : current;
    });
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    // Create a simplified object with author name and likes
    const blogStats = blogs.map((blog) => ({
      author: blog.author,
      likes: blog.likes,
    }));

    //Group them based on author names
    const grouped = Object.groupBy(blogStats, (blog) => blog.author);

    //Cumulate the likes for each author
    const likesCount = Object.keys(grouped).map((item) => ({
      author: item,
      likes: grouped[item].reduce((sum, i) => sum + i.likes, 0),
    }));

    //Determine the one with most number of likes
    return likesCount.reduce(function (prev, current) {
      return prev && prev.likes > current.likes ? prev : current;
    });
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
