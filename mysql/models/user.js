// users 테이블과 연결하기 위한 user 모델 사용
const Sequelize = require('sequelize')

// User 모델을 만들고 모듈로 exports
// User 모델은 Sequelize.Model을 확장한 클래스로 선언
module.exports = class User extends Sequelize.Model {
  // 모델은 크게 static init 메서드와 static associate 메서드로 나뉨
  // init 메서드 = 테이블에 대한 설정
  static init(sequelize) {
    return super.init(
      // super.init 메서드의 첫 번째 인수 = 테이블 컬럼에 대한 설정
      // 시퀄라이즈는 알아서 id를 기본 키로 연결
      // => id 컬럼은 적어줄 필요 X
      {
        // name 컬럼
        name: {
          // VARCHAR => STRING
          type: Sequelize.STRING(20),
          // NOT NULL
          allowNull: false,
          // UNIQUE
          unique: true,
        },

        // age 컬럼
        age: {
          // INT => INTEGER
          // INTEGER.UNSIGNED = UNSIGNED 옵션이 적용된 INT
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },

        // married 컬럼
        married: {
          // TINYINT => BOOLEAN
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },

        // comment 컬럼
        comment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        // created_at 컬럼
        created_at: {
          // DATETIME => DATE
          type: Sequelize.DATE,
          allowNull: false,
          // DEFAULT now() => defaultValue: Sequelize.NOW
          defaultValue: Sequelize.NOW,
        },
      },
      // super.init 메서드의 두 번째 인수 = 테이블 옵션
      {
        // static init 메서드의 매개변수와 연결되는 옵션
        sequelize,
        // 각각 로우가 생성될 때와 수정될 때의 시간이 자동으로 입력
        timestamps: false,
        // 캐멀 케이스(camel case)(예시 : createAt)을 스네이크 케이스(snake case)(예시 : created_at)로 바꾸는 옵션
        underscored: false,
        // 모델 이름을 설정
        modelName: 'User',
        // 실제 데이터베이스의 테이블 이름
        tableName: 'users',
        // true로 설정 시 deletedAt이라는 컬럼이 생김
        // 로우를 삭제할 때 완전히 지워지지 않고 deletedAt에 지운 시각이 기록
        paranoid: false,
        // utf8과 utf8_general_ci로 설정 시 한글이 입력
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  // associate 메서드 = 다른 모델과의 관계(즉 외래키)
  static associate(db) {
    // 1:N(user:comment) 관계를 hasMany 메서드로 표현
    //  users 테이블의 로우 하나를 불러올 때 연결된 comments 테이블의 로우들 호출
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' })
  }
}
