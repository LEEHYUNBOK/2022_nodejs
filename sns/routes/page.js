// express 불러오기
const express = require('express')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const { Post, User, Hashtag } = require('../models')

// express router 사용
const router = express.Router()

// 라우터 미들웨어를 만들어 템플릿 엔진에서 사용 변수들 res.locals로 설정
router.use((req, res, next) => {
  // res.locals.user 에 req.user 대입
  res.locals.user = req.user
  // res.locals.followerCount 에 user가 있다면 Followers의 길이 대입 아니면 0 대입
  res.locals.followerCount = req.user ? req.user.Followers.length : 0
  // res.locals.followingCount 에 user가 있다면 Followings의 길이 대입 아니면 0 대입
  res.locals.followingCount = req.user ? req.user.Followings.length : 0
  // res.locals.followerIdList 에 user가 있다면 followings의 모든 id값을 대입 아니면 빈 배열 대입
  res.locals.followerIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : []
  // 다음 미들웨어 실행
  next()
})

// GET /profile 요청 시
// isLoggedIn가 true여야 실행된다.
router.get('/profile', isLoggedIn, (req, res) => {
  // profile.html 출력, { title: "내정보 Node-Bird" } 객체도 같이 보냄
  res.render('profile', { title: '내 정보 - NodeBird' })
})

// GET /join 요청 시
// isNotLoggedIn가 true여야 실행된다.
router.get('/join', isNotLoggedIn, (req, res) => {
  // join.html 출력, { title: '회원가입 - NodeBird' } 객체도 같이 보냄
  res.render('join', { title: '회원가입 - NodeBird' })
})

// GET /  요청시
router.get('/', async (req, res, next) => {
  try {
    // Post 테이블에 들어있는 내용 모두 출력
    const posts = await Post.findAll({
      include: {
        // user를 가지고 있는 내용으로 출력
        model: User,
        // id, nick 으로 출력
        attributes: ['id', 'nick'],
      },
      // 날짜 순으로 불러오기
      order: [['createdAt', 'DESC']],
    })
    // main.html 에 렌더링
    res.render('main', {
      // title:NodeBird로 하고 twits는 Post DB를 모두 출력한 것을 저장
      title: 'NodeBird',
      twits: posts,
    })
  } catch (err) {
    // 오류시 err 출력
    console.error(err)
    next(err)
  }
})

// GET /hashtag  요청시
router.get('/hashtag', async (req, res, next) => {
  // reqaust로 받은 hashtag를 query변수에 저장
  const query = req.query.hashtag
  // query가 없다면
  if (!query) {
    // GET / 로 다시 요청
    return res.redirect('/')
  }
  try {
    // hashtage에 저장하여 Hashtag 테이블에 title이 query인 것만 찾아서 출력
    const hashtag = await Hashtag.findOne({ where: { title: query } })
    let posts = []
    // 만약 hashtag가 있으면
    if (hashtag) {
      // hashtag 변수가 있는 Post를 user를 포함하여 posts변수에 저장
      posts = await hashtag.getPosts({ include: [{ model: User }] })
    }
    // main.html 랜더링
    return res.render('main', {
      // title:NodeBird로 하고 twits는 posts 변수를 저장하고 같이 랜더링
      title: `${query} | NodeBird`,
      twits: posts,
    })
  } catch (error) {
    // error 발생시 실행
    console.error(error)
    return next(error)
  }
})

module.exports = router
