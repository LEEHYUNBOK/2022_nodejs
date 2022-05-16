// sequelize 불러오기
const Sequelize = require('sequelize')

// Hashtag 테이블 sequelize로 만듦
module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // title 컬럼
        title: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Hashtag',
        tableName: 'hashtags',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    )
  }

  // Post 테이블와 연결
  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' })
  }
}
