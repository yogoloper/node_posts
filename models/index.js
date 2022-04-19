'use strict';

const Sequelize = require('sequelize');
const User = require('./user');
const Admin = require('./admin');
const Post = require('./post');
const Comment = require('./comment');
const Like = require('./like');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.User = Admin;
db.Post = Post;
db.Comment = Comment;
db.Like = Like;

User.init(sequelize);
Admin.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Like.init(sequelize);

User.associate(db);
Admin.associate(db);
Post.associate(db);
Comment.associate(db);
Like.associate(db);

module.exports = db;
