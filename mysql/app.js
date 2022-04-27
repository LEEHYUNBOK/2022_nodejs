// express 생성
const express = require('express')

// 파일의 경로를 지정 하기 위한 path 모듈 사용
const path = require('path')

// 로깅(logging)에 도움을 주는 morgan 미들웨어 모듈 사용
// 로깅 = 무슨 일이 어디에서 일어났는지를 기록하는 것
const morgan = require('morgan')

const nunjucks = require('nunjucks')

// MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리, ORM(Object-relational Mapping)으로 분류
// ORM = 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구
// 시퀄라이즈를 쓰는 이유는 자바스크립트 구문을 알아서 SQL로 바꿔주기 때문
const { sequelize } = require('./models')

// index.js, user.js, comment.js를 app.js에 연결하기 위한 변수 선언
const indexRouter = require('./routes')
const usersRouter = require('./routes/users')
const commentsRouter = require('./routes/comments')

// express를 app으로 사용
const app = express()

// 서버가 실행될 포트를 설정
app.set('port', process.env.PORT || 3001)

app.set('view engine', 'html')
nunjucks.configure('views', {
  express: app,
  watch: true,
})
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공')
  })
  .catch((err) => {
    console.error(err)
  })

// morgan 미들웨어 사용
// dev 모드 기준으로 GET / 500 7.409 ms – 50은 각각 [HTTP 메서드] [주소] [HTTP 상태 코드] [응답 속도] - [응답 바이트]를 의미
// 인수로 dev 외에 combined, common, short, tiny 등 사용 가능
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// index.js, user.js, comment.js를 app.use를 통해 app.js에 연결
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)

// 라우터가 없다면 404 상태 코드를 응답하는 미들웨어 하나 추가
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
  error.status = 404
  next(error)
})

//
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

// 포트를 연결하고 서버를 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중')
})
