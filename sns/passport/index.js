// passport 모듈 생성
const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

module.exports = () => {
  // passport 핵심
  // serializeUser는 로그인 시 실행
  // req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
  // 매개변수 user를 받고
  // 사용자 정보 객체를 세션에 아이디로 저장하는 것
  passport.serializeUser((user, done) => {
    // done 함수로 user.id를 넘기기
    /* done 함수
     첫번째 인수 : 에러 발생 시 사용
     두번째 인수 : 저장하고 싶은 데이터 저장
     사용자 정보를 세션에 저장하는데 사용자 정보를 모두 저장하면 
     용량을 많이 차지하여 일괄성 문제 발생하기 때문에 사용자 id만 저장하라고 명령한 것
     */
    done(null, user.id)
  })
  // deserializeUser 매 요청 시 실행
  // passport.session 미들웨어가 이 메서드를 호출
  // 사용자의 id를 매개변수로 받음
  // 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
  passport.deserializeUser((id, done) => {
    // serializeUser에서 세션에 저장했던 아이디 받아
    // 데이터베이스에서 사용자 정보 조회
    User.findOne({
      where: { id },
      // followers, followings 추가 해서 가져오기
      include: [
        {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followers',
        },
        {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followings',
        },
      ],
    })
      // 결과값 보내기
      .then((user) => done(null, user))
      .catch((err) => done(err))
  })

  local()
  kakao()
}
