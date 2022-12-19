const { validationResult } = require('express-validator');

const Post = require('../models/post');
const ApiError = require('../exceptions/api-error');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: 'Fetched posts successfully!',
      posts
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(ApiError.UnprocessableEntity('Validation failed, entered data is incorrect.'));
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
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      next(ApiError.NotFound('Could not find a post.'));
    }

    res.status(200).json({
      message: 'Post fetched!',
      post
    });
  } catch(err) {
    next(err);
  }
};