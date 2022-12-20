const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const ApiError = require('../exceptions/api-error');
const clearImage = require('../utils/clear-image');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post
      .find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched posts successfully!',
      posts,
      totalItems
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
    creator: req.userId,
  });

  try {
    await post.save()

    const user = await User.findById(req.userId);

    user.posts.push(post);

    await user.save();

    res.status(201).json({
      message: 'Post created successfully!',
      post,
      creator: {
        _id: user._id.toString(),
        name: user.name
      }
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
      return next(ApiError.NotFound('Could not find a post.'));
    }

    res.status(200).json({
      message: 'Post fetched!',
      post
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(ApiError.UnprocessableEntity('Validation failed, entered data is incorrect.'));
  }

  const { title, content } = req.body;
  const imageUrl = req.file
    ? req.file.path.replace('\\', '/')
    : req.body.image;

  if (!imageUrl) {
    return next(ApiError.UnprocessableEntity('No image provided.'));
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(ApiError.NotFound('Could not find a post.'));
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    await post.save();

    res.status(200).json({
      message: 'Post updated!',
      post
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(ApiError.NotFound('Could not find a post.'));
    }

    clearImage(post.imageUrl);

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      message: 'Deleted post!'
    });
  } catch (err) {
    next(err);
  }
};