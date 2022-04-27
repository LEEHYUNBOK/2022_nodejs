// 시퀄라이즈 패키지이자 생성자
const Sequelize = require('sequelize')

// user, comment 불러오기
const User = require('./user')
const Comment = require('./comment')

// env파일의 내용이나  config의 development를 사용
const env = process.env.NODE_ENV || 'development'
// config 파일 불러서 저장
const config = require('../config/config')[env]
// db에 차례로 저장
const db = {}

// config의 database,username,password, config의 나머지를 sequelize에 저장
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

// 연결 객체를 나중에 재사용하기 위해 db.sequelize에 저장
db.sequelize = sequelize

// db에 User와 Comment 모델 저장
db.User = User
db.Comment = Comment

// User.init과 Comment.init은  각각의 모델의 static.init 메서드 호출
User.init(sequelize)
Comment.init(sequelize)

// 다른 테이블과의 관계를 연결하는 associate 메서드 실행
User.associate(db)
Comment.associate(db)

module.exports = db
