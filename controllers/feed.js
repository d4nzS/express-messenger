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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(ApiError.UnprocessableEntity('Validation failed, entered data is incorrect.'));
  }

  if (!req.file) {
    return next(ApiError.UnprocessableEntity('No image provided.'));
  }

  const { title, content } = req.body;
  const imageUrl = req.file.path.replace('\\', '/');

  const post = new Post({
    title,
    content,
    imageUrl,
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