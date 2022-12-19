const { validationResult } = require('express-validator');

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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect',
      errors: errors.array()
    });
  }

  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: Date.now(),
      title,
      content,
      creator: {
        name: 'Denis'
      },
      createdAt: new Date()
    }
  });
};