const Sequelize = require('sequelize');

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Like',
        tableName: 'likes',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.Like.removeAttribute('id')
    db.Like.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id' });
    db.Like.belongsTo(db.Post, { foreignKey: 'post_id', sourceKey: 'id' });
  }
};
