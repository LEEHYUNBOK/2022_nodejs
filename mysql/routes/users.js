const express = require('express')
const User = require('../models/user')
const Comment = require('../models/comment')

const router = express.Router()

// /users 주소로 요청이 들어올 때의 라우터
router
  .route('/')
  // 메소드 = get 일경우
  .get(async (req, res, next) => {
    try {
      // user의 정보를 findAll
      const users = await User.findAll()
      // users의 데이터를 JSON 형식으로 반환
      res.json(users)
    } catch (err) {
      // 오류시 error 출력
      console.error(err)
      next(err)
    }
  })
  // 메소드 = post 일경우
  .post(async (req, res, next) => {
    try {
      // user의 정보를 create(이름, 나이, 결혼여부) 만들어서 추가
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      })
      // user 정보 log
      console.log(user)
      // 상태코드 201 : 요청이 성공적으로 처리되었으며, 자원이 생성되었음을 나타내는 성공 상태 응답 코드
      // user의 데이터를 JSON 형식으로 반환
      res.status(201).json(user)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

router.get('/:id/comments', async (req, res, next) => {
  try {
    // user의 id가 파라미터로 받은 id 값과 같은 comment만 검색
    const comments = await Comment.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    })
    // comments 정보 log
    console.log(comments)
    // comments의 데이터를 JSON 형식으로 반환
    res.json(comments)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// router export
module.exports = router
