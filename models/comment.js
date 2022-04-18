const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.TEXT,
        },
        active: {
          type: Sequelize.TINYINT,
          defaultValue: true,
        },
        created: {
          type: Sequelize.DATE,
          defaultValue: Date.now(),
          get() {
            return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
          }
        },
        updated: {
          type: Sequelize.DATE,
          get() {
            return moment(this.getDataValue('updated')).format('YYYY-MM-DD HH:mm:ss');
          }
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id' });
    db.Comment.belongsTo(db.Post, { foreignKey: 'post_id', sourceKey: 'id' });
  }
};
