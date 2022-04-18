const express = require('express');

const jwt = require('jsonwebtoken');

const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');

// 게시글 목록 조회
router.get('/posts', async (req, res, next) => {
  try {
    // 토큰이 있으면 userId 추출
    let user;
    const { authorization } = req.headers;

    if (authorization != null) {
      const [tokenType, token] = authorization.split(' ');

      // 토큰 타입이 다르면 401 반환
      if (tokenType && tokenType === 'Bearer') {
        user = jwt.verify(token, 'secretKey');
      }
    }

    // 게시물 목록 조회
    const posts = await Post.findAll({
      where: {
        active: true,
      },
    });

    // 좋아요수, 해당 유저의 좋아요 확인
    let likeCnt = 0;
    let isLike = false;

    // 반복문을 돌면서 좋아요 체크
    for (let i = 0; i < posts.length; i++) {
      const likes = await Like.findAll({
        where: {
          post_id: posts[i].getDataValue('id'),
        },
      });
      // 좋아요수 추가
      posts[i].setDataValue('likeCnt', likes.length);

      // 유저가 존재하면 해당 게시물에 좋아요 확인
      if (user != null) {
        const like = await Like.findOne({
          where: {
            post_id: posts[i].getDataValue('id'),
            user_id: user.userId,
          },
        });

        // 좋아요 있으면 추가
        if (like != null) {
          posts[i].setDataValue('isLike', true);
        }
      }
    }

    res.status(200).send({ posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 게시글 상세 조회
router.get('/posts/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    // 게시글 상세 조회
    const post = await Post.findOne({
      where: {
        id: postId,
        active: true,
      },
    });

    if (post == null) {
      res.status(200).send({
        result: {
          success: true,
          message: 'OK',
        },
      });
    }

    // 댓글 조회
    const comments = await Comment.findAll({
      where: {
        post_id: postId,
        active: true,
      },
    });
    if (comments != null) {
      post.setDataValue('comments', comments);
    }

    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 게시글 작성
router.post('/posts', authMiddleware, async (req, res, next) => {
  try {
    const { title, content, image_url } = req.body;

    // 게시글 작성
    const createdPost = await Post.create({
      user_id: res.locals.userId,
      title,
      content,
      image_url,
    });

    return res.status(201).send({ createdPost });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 게시글 수정
router.put('/posts/:postId', authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content, image_url } = req.body;

    // 게시글 수정
    const updatedPost = await Post.update(
      {
        user_id: res.locals.userId,
        title,
        content,
        image_url,
        updated: Date.now(),
      },
      {
        where: {
          id: postId,
        },
      }
    );

    return res.send(201);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 게시글 삭제
router.delete('/posts/:postId', authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content, image_url } = req.body;

    // 게시글 삭제 플레그 수정
    const updatedPost = await Post.update(
      {
        active: false,
        updated: Date.now(),
      },
      {
        where: {
          id: postId,
        },
      }
    );

    // 해당 게시글의 댓글들 삭제 플레그 수정
    const updatedComment = await Comment.update(
      {
        active: false,
        updated: Date.now(),
      },
      {
        where: {
          post_id: postId,
        },
      }
    );

    return res.send(201);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 댓글 작성
router.post(
  '/posts/:postId/comments',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      // 댓글 작성
      const createdComment = await Comment.create({
        user_id: res.locals.userId,
        post_id: postId,
        content,
      });

      return res.status(201).send({ createdComment });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

// 댓글 수정
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { content } = req.body;

      // 댓글 수정
      const updatedComment = await Comment.update(
        {
          content: content,
          updated: Date.now(),
        },
        {
          where: {
            id: commentId,
            post_id: postId,
          },
        }
      );

      return res.status(201).send({ updatedComment });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

// 댓글 삭제
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;

      // 댓글 삭제 플레그 수정
      const updatedComment = await Comment.update(
        {
          active: false,
          updated: Date.now(),
        },
        {
          where: {
            id: commentId,
            post_id: postId,
          },
        }
      );

      return res.status(201).send({ updatedComment });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

// 좋아요 작성
router.post('/posts/:postId/like', authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 좋아요 작성
    const createdLike = await Like.create({
      user_id: res.locals.userId,
      post_id: postId,
    });

    return res.status(201).send({ createdLike });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 좋아요 취소
router.delete('/posts/:postId/like', authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 좋아요 취소
    const deletedLike = await Like.destroy({
      where: {
        user_id: res.locals.userId,
        post_id: postId,
      },
    });

    return res.status(200).send({ deletedLike });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
