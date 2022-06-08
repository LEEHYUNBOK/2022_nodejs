// sequelize 불러오기
const Sequelize = require('sequelize')
// env에서 지정값 가져오기
const env = process.env.NODE_ENV || 'development'
// config파일에서 env에서 불러온 값 추가하기
const config = require('../config/config')[env]
// models 폴더의 각각의 .js파일 불러오기
const User = require('./user')
const Post = require('./post')
const Hashtag = require('./hashtag')
const Choose = require('./choose')
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

// db에 User, Post, Hashtag 모델 저장
db.User = User
db.Post = Post
db.Hashtag = Hashtag
db.Choose = Choose

// 각각의 모델의 static.init 메서드 호출
User.init(sequelize)
Post.init(sequelize)
Hashtag.init(sequelize)
Choose.init(sequelize)

// 다른 테이블과의 관계를 연결하는 associate 메서드 실행
User.associate(db)
Post.associate(db)
Hashtag.associate(db)

module.exports = db
