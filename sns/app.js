// express 생성
const express = require('express')

// cookie-parser = 요청에 동봉된 쿠키를 해석해 req.cookies 객체 만드는 모듈
const cookieParser = require('cookie-parser')

// 로깅(logging)에 도움을 주는 morgan 미들웨어 모듈 사용
// 로깅 = 무슨 일이 어디에서 일어났는지를 기록하는 것
const morgan = require('morgan')

// 파일의 경로를 지정 하기 위한 path 모듈 사용
const path = require('path')

// 세션 관리용 미들웨어 모듈 사용
// 로그인 등의 이유로 세션을 구현하거나
// 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')

// 세션과 쿠키 처리 등 복잡한 작업이 많으므로 passport모듈 사용
const passport = require('passport')

dotenv.config()

// page.js, auth.js, post.js, user.js를 app.js에 연결하기 위한 변수 선언
const pageRouter = require('./routes/page')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

// MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리, ORM(Object-relational Mapping)으로 분류
// ORM = 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구
// 시퀄라이즈를 쓰는 이유는 자바스크립트 구문을 알아서 SQL로 바꿔주기 때문
const { sequelize } = require('./models')
const passportConfig = require('./passport')

// express를 app으로 사용
const app = express()
passportConfig() // 패스포트 설정

// 서버가 실행될 포트를 설정
app.set('port', process.env.PORT || 8001)
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

// publie/sequelize.js를 상위 파일로 지정
app.use(express.static(path.join(__dirname, 'public')))

// 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악 불가
// => 보안에 큰 도움
// /img 요청 시 uploads를 파일 실행
app.use('/img', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
)

// 요청(req 객체)에 passport 설정을 심고
app.use(passport.initialize())
// req.session 객체에 passport정보 저장
// express-session에서 생성하는 것이므로 express-session 미들웨어보다 뒤에 연결
app.use(passport.session())

// router 사용법
app.use('/', pageRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
  error.status = 404
  next(error)
})

// 미들웨어 에러 발생시
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중')
})
