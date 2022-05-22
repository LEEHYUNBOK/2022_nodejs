// passport 모듈 불러오기
const passport = require('passport')
// passport-local 모듈에서 Strategy 생성자를 불러와 그 안에서 전략 구현
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../models/user')

module.exports = () => {
  passport.use(
    // LocalStrategy 생성자의 첫번째 인수로 주어진 객체는 전략에 관한 설정 하는 곳
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } })
          // email을 가진 user가 있다면
          if (exUser) {
            // 비밀번호를 비교
            const result = await bcrypt.compare(password, exUser.password)
            // 일치한다면
            if (result) {
              // passport,authenticate 콜백 함수 실행
              done(null, exUser)
            }
            // 불일치 한다면 '비밀번호가 일치하지 않습니다.' 실행
            else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
            }
          }
          // 사용자가 없다면 '가입되지 않은 회원입니다.' 실행
          else {
            done(null, false, { message: '가입되지 않은 회원입니다.' })
          }
        } catch (error) {
          console.error(error)
          done(error)
        }
      }
    )
  )
}
