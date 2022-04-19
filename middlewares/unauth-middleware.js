const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization != null && authorization.length > 0) {
      res.header('authorization', authorization).status(400).send({
        success: false,
        message: '이미 로그인 되어 있습니다.',
      });
      return;
    }
    next()

  } catch (err) {
    res.header('authorization', authorization).status(400).send({
      success: false,
      message: '이미 로그인 되어 있습니다.',
    });
    return;
  }
};
