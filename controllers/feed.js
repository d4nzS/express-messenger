const { validationResult } = require('express-validator');

const Post = require('../models/post');

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

exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect',
      errors: errors.array()
    });
  }

  const post = new Post({
    title,
    content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Denis' },
  });

  try {
    await post.save()

    res.status(201).json({
      message: 'Post created successfully!',
      post
    });
  } catch (err) {
    console.log(err);
  }
};