// sequelize 불러오기
const Sequelize = require('sequelize')

// User 테이블 sequelize로 만듦
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // email 컬럼
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        // nick 컬럼
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        // password 컬럼
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        // provider 컬럼
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'local',
        },
        // snsId 컬럼
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }

  // 모델 간의 관계 설정
  static associate(db) {
    // Post 테이블과는 1:N 관계이므로 hasMany 로 연결
    db.User.hasMany(db.Choose)
    db.User.hasMany(db.Post)
    // Follow 모델과 N:M관계이다.
    // 둘다 User 모델이라 구분되지 않기때문에 as옵션을 넣어서 구분
    // followers를 찾으려면 followingId에 대해 찾고
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    })
    // Followings를 찾으려면 followerId에 대해 찾는다.
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    })
    // 스스로 해보기 3번 게시글 좋아요 누르기 및 좋아요 취소하기
    db.User.belongsToMany(db.Post, { through: 'PostLikes', as: 'Likes' })
  }
}
