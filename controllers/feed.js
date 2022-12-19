exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: Date.now(),
        title: 'First Post',
        content: 'The first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Denis'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;

  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      id: Date.now(),
      title,
      content
    }
  });
};