const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nickname: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          comment: '사용자 닉네임, 로그인시 이용',
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
          comment: '비밀번호',
        },
        image_url: {
          type: Sequelize.STRING(255),
          comment: '사용자 프로필 URL',
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'user_id', sourceKey: 'id' });
    db.User.hasMany(db.Comment, { foreignKey: 'user_id', sourceKey: 'id' });
    db.User.hasMany(db.Like, { foreignKey: 'user_id', sourceKey: 'id' });
  }
};
