const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        choose1: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        choose2: {
          type: Sequelize.STRING(140),
          allowNull: false,
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

  static associate(db) {
    db.Post.hasMany(db.Choose)
    db.Post.belongsTo(db.User)
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
    // 스스로 해보기 3번 게시글 좋아요 누르기 및 좋아요 취소하기
    db.Post.belongsToMany(db.User, { through: 'PostLikes', as: 'Likes' })
  }
}
