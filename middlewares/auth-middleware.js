const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, token] = authorization.split(' ');
    
    // 토큰 타입이 다르면 401 반환
    if (!tokenType || tokenType !== 'Bearer') {
        res.status(401).send({
        success: false,
        message: '로그인 후 사용하세요.',
      });
      return;
    }

    // 토큰에서 userId를 받아온다.
    const {userId} = jwt.verify(token, 'secretKey');
    
    // userId를 locals에 다아서 사용
    res.locals.userId = userId;
    next();

  } catch (error) {
    res.status(401).send({
      success: false,
      message: '로그인 후 사용하세요.',
    });
  }
};
