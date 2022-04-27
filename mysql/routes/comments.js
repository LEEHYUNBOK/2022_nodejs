const express = require('express')

// models 파일에 있는 User, Comment 파일을 불러온다.
const { User, Comment } = require('../models')

// express의 라우터x
const router = express.Router()

// POST /comments 라우터는 댓글을 생성하는 라우터
router.post('/', async (req, res, next) => {
  try {
    // comment의 정보를 create(id, 내용) 만들어서 추가
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    })
    // comment 정보 log
    console.log(comment)

    // 성공적으로 처리되면 user의 데이터를 JSON 형식으로 반환
    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// /comments/:id 주소로 요청이 들어올 때의 라우터
router
  .route('/:id')
  // PATCH 메소드 호출 시 댓글 수정 라우터
  .patch(async (req, res, next) => {
    try {
      // comment의 id가 파라미터로 받은 id 값과 같은 comment를 찾아서 파라미터로 받은 comment의 값으로 변경
      const result = await Comment.update(
        {
          comment: req.body.comment,
        },
        {
          where: { id: req.params.id },
        }
      )
      // result의 데이터를 JSON 형식으로 반환
      res.json(result)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })
  // DELETE 메소드 호출 시 댓글 삭제 라우터
  .delete(async (req, res, next) => {
    try {
      // comment의 id가 파라미터로 받은 id 값과 같은 comment를 찾아서 삭제
      const result = await Comment.destroy({ where: { id: req.params.id } })
      // result의 데이터를 JSON 형식으로 반환
      res.json(result)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

// router export
module.exports = router
