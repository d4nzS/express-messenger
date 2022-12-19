const { Router } = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = Router();

router.get('/posts', feedController.getPosts);

router.post(
  '/post',
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createPost
);

module.exports = router;