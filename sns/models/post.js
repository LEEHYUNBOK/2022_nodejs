// sequelize 불러오기
const Sequelize = require('sequelize')

// post 테이블 sequelize로 만듦
module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // content 컬럼
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        // img 컬럼
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    )
  }
  // Hashtag와 User 테이블와 연결
  static associate(db) {
    db.Post.belongsTo(db.User)
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
  }
}
