const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');

// 관리자 로그인
router.post('/admins/login', async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    // 관리자 검색
    const [existAdmin] = await Admin.findAll({
      where: {
        nickname: nickname,
        password: password,
      },
    });

    // 해당하는 계정이 없으면  400 반환
    if (existAdmin.length == 0) {
      return res.status(400).send({
        success: false,
        message: '계정 정보가 일치하지 않습니다.',
      });
    }

    const token = jwt.sign({ userId: existAdmin.dataValues.id }, 'secretKey');

    // token은 헤더에 담아서 전달,
    // nickname, image_url, admin 여부는 바디로 전달
    return res
      .header('authorization', 'Bearer ' + token)
      .status(201)
      .send({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
