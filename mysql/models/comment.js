// comments 테이블과 연결하기 위한 comment 모델 사용
const Sequelize = require('sequelize')

// Comment 모델을 만들고 모듈로 exports
// Comment 모델은 Sequelize.Model을 확장한 클래스로 선언
module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // comment 컬럼
        comment: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        // created_at 컬럼
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        // utf8mb4와 utf8mb4_general_ci 설정 시 한글, 이모티콘 입력 가능
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    )
  }

  static associate(db) {
    // N:1(comment:user) 관계를 belongsTo 메서드로 표현
    // comments 테이블의 로우를 불러올 때 연결된 users 테이블의 로우 호출
    db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' })
  }
}
