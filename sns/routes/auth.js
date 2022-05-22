// express 불러오기
const express = require('express')
const passport = require('passport')

// 비밀번호를 암호화하기 위해 사용하는 모듈
// hash 함수를 사용하기 위한 모듈
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const User = require('../models/user')

const router = express.Router()

const cacheUser = require('../passport/cacheUser')

// POST /join 요청 시
// 로그인 안한 경우에만 사용 가능
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  // email, nick, password 를 받아서 변수에 저장
  const { email, nick, password } = req.body
  try {
    // email을 같는 user를 찾는다.
    const exUser = await User.findOne({ where: { email } })
    // user가 있다면
    if (exUser) {
      // '/join?error=exist'으로 redirect 한다.
      return res.redirect('/join?error=exist')
    }
    // password를 암호화하여 User 테이블에 저장한다.
    const hash = await bcrypt.hash(password, 12)
    await User.create({
      email,
      nick,
      password: hash,
    })
    // '/'이곳으로 redirect한다.
    return res.redirect('/')
  } catch (error) {
    console.error(error)
    return next(error)
  }
})

// POST /login 요청 시
// 로그인 안한 경우에만 사용 가능
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // local 로그인 전략 수행
  passport.authenticate('local', (authError, user, info) => {
    // 만약 error가 있다면
    if (authError) {
      // 에러 출력
      console.error(authError)
      return next(authError)
    }
    // 만약 user가 없다면
    if (!user) {
      // `/?loginError=${info.message}`로 redirect 수행
      return res.redirect(`/?loginError=${info.message}`)
    }

    // req.login은 passport.serializeUser를 호출
    return req.login(user, (loginError) => {
      // 로그인 시 오류 생기면 error 출력
      if (loginError) {
        console.error(loginError)
        return next(loginError)
      }
      // '/' redirect
      return res.redirect('/')
    })
  })(req, res, next) // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
})

// GET /logout 요청 시
// 로그인 한 경우에만 사용 가능
router.get('/logout', isLoggedIn, (req, res) => {
  // req.user 객체를 제거하고
  req.logout()

  cacheUser.delete()
  // req.session 객체의 내용을 제거
  req.session.destroy()
  // '/' redirect
  res.redirect('/')
})

router.get('/kakao', passport.authenticate('kakao'))

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/')
  }
)

module.exports = router
