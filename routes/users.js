const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const unAuthMiddleware = require('../middlewares/unauth-middleware');

// 사용자 회원가입
router.post('/users/register', unAuthMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    const { nickname, password, confirmPassword, imageUrl } = req.body;

    const check_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

    // 닉네임은 길이 3자 이상의 영문, 숫자로 구성
    if (
      nickname.length < 3 ||
      check_spc.test(nickname) ||
      check_kor.test(nickname)
    ) {
      return res.status(400).send({
        success: false,
        message: '아이디는 3자 이상, 알파벳 대소문자, 숫자로 구성하여 주세요.',
      });
    }

    // 비밀번호는 4자 이상, 닉네임에 포함되지 않은 값으로 구성
    if (password.length < 4 || nickname.search(password) >= 0) {
      return res.status(400).send({
        success: false,
        message:
          '패스워드는 4자이상, 닉네임에 포함되지 않은 값으로 구성하여 주세요.',
      });
    }

    console.log(4);
    // 비밀번호가 일치 하지 않으면 실패
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // 유저 검색
    const existUsers = await User.findAll({
      where: {
        nickname: nickname,
      },
    });

    // 해당 메일, 닉네임으로 가입된 회원이 있으면 400 반환
    if (existUsers.length > 0) {
      return res.status(400).send({
        success: false,
        message: '이미 가입된 회원 정보 입니다.',
      });
    }

    // 사용자 회원가입
    const createdUser = await User.create({
      nickname,
      password,
      imageUrl,
    });

    return res.send(201).send();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 사용자 로그인
router.post('/users/login', unAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body)
    const { nickname, password } = req.body;

    // 유저 검색
    const [existUser] = await User.findAll({
      where: {
        nickname,
        password,
      },
    });

    // 해당하는 계정이 없으면  400 반환
    if (existUser == null) {
      return res.status(400).send({
        success: false,
        message: '계정 정보가 일치하지 않습니다.',
      });
    }

    const token = jwt.sign(
      { userId: existUser.dataValues.id, isAdmin: false },
      'secretKey'
    );

    // token은 헤더에 담아서 전달,
    // nickname, imageUrl, admin 여부는 바디로 전달
    return res
      .header('authorization', 'Bearer ' + token)
      .status(201)
      .send({
        nickname: existUser.nickname,
        isAdmin: false,
        token,
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
