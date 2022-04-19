const Sequelize = require('sequelize');

module.exports = class Admin extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nickname: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
          comment: '비밀번호',
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Admin',
        tableName: 'admins',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {}
};
