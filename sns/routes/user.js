// express 불러오기
const express = require('express')

const { isLoggedIn } = require('./middlewares')

// user모델 불러오기
const User = require('../models/user')

const cacheUser = require('../passport/cacheUser')

const router = express.Router()

// POST /:(세션에 있는 아이디)/follow 요청 시
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    // User 테이블에서 id가 user.id인 user를 user변수에 저장
    const user = await User.findOne({ where: { id: req.user.id } })
    // user가 있다면
    if (user) {
      // user에 id(10진수로 만든 후)값을 following하고 있는 사람에 추가한다.
      await user.addFollowing(parseInt(req.params.id, 10))
      // 'success' 보내기
      cacheUser.change(true)
      res.send('success')
    } else {
      // 오류시 no user 보내기
      res.status(404).send('no user')
    }
  } catch (error) {
    // error 발생시 실행
    console.error(error)
    next(error)
  }
})

// 스스로 해보기 1번 팔로우 끊기
router.post('/:id/followDelete', isLoggedIn, async (req, res, next) => {
  try {
    // User 테이블에서 id가 user.id인 user를 user변수에 저장
    const user = await User.findOne({ where: { id: req.user.id } })
    // user가 있다면
    console.log(user)
    console.log(req.params.id)
    if (user) {
      // user에 id(10진수로 만든 후)값을 following하고 있는 사람에 추가한다.
      await user.removeFollowing(parseInt(req.params.id, 10))
      // 'success' 보내기
      cacheUser.change(true)
      res.send('success')
    } else {
      // 오류시 no user 보내기
      res.status(404).send('no user')
    }
  } catch (error) {
    // error 발생시 실행
    console.error(error)
    next(error)
  }
})

// 스스로 해보기 2번 프로필 정보 변경
router.post('/profile', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({ nick: req.body.edit }, { where: { id: req.user.id } })
    cacheUser.change(true)
    res.redirect('/profile')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router
