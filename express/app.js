const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

// router 사용
const indexRouter = require('./routes')
const userRouter = require('./routes/user')

const app = express()
app.set('port', process.env.PORT || 3000)

app.use(morgan('dev'))
app.use('/', express.static(path.join(__dirname, 'public')))
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
    name: 'session-cookie',
  })
)

app.use((req, res, next) => {
  console.log('모든 요청에 다 실행됩니다.')
  next()
})

// multer 미들웨어 사용
const multer = require('multer')
const fs = require('fs')

try {
  fs.readdirSync('uploads')
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
  fs.mkdirSync('uploads')
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/')
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname)
      done(null, path.basename(file.originalname, ext) + Date.now() + ext)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

app.get('/upload', (req, res) => {
  console.log('TTT')
  res.sendFile(path.join(__dirname, 'multipart.html'))
})

app.post(
  '/upload',
  upload.fields([{ name: 'image1' }, { name: 'image2' }]),
  (req, res) => {
    console.log(req.files, req.body)
    res.send('ok')
  }
)

// router 사용법
app.use('/', indexRouter)
app.use('/user', userRouter)

app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

// /경로로 실행시 에러 발생 시키기
app.get(
  '/',
  (req, res, next) => {
    console.log('GET / 요청에만 실행됩니다.')
    next()
  },
  (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
  }
)

// app.get('/', (req, res) => {
//   // res.send('Hello, Express')
//   res.sendFile(path.join(__dirname, '/index.html'))
// })

// 미들웨어 에러 발생시
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send(err.message)
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중')
})
