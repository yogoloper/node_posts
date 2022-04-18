const express = require('express');
const app = express();
const port = 3000;

const { sequelize } = require('./models');

const authMiddleware = require('./middlewares/auth-middleware');

// 라우터 정보 가져오기
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

sequelize.sync({ force: false })
.then(() => {
  console.log('Database connected..');
})
.catch((err) => {
  console.log(err)
})

// 접속 경로 로그 미들웨어
const requestMiddleware = (req, res, next) => {
  console.log('request URL : ', req.originalUrl, ' - ', new Date());
  next();
};

app.use(requestMiddleware);
app.use(express.json());

// api 경로시 배열에 있는 라우터 순서대로 우선순위를 정한다.
app.use('/api', [postsRouter, usersRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 생성되었습니다.');
});
