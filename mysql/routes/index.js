const express = require('express')

// models 파일에 있는 User 파일을 불러온다.
const User = require('../models/user')

const router = express.Router()

// 먼저 GET /로 접속했을 때의 라우터
router.get('/', async (req, res, next) => {
  try {
    // User를 모두 찾는 findAll
    const users = await User.findAll()
    // users과 함께 sequelize.html을 렌더링
    res.render('sequelize', { users })
  } catch (err) {
    // 오류시 error 출력
    console.error(err)
    next(err)
  }
})

// router export
module.exports = router
