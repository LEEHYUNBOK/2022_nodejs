// express 불러오기
const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const cacheUser = require('../passport/cacheUser')

// Post, Hashtag 모델 불러오기
// 스스로 해보기 3번 게시글 좋아요 누르기 및 좋아요 취소하기
const { Post, Hashtag, User, Choose } = require('../models')

const { isLoggedIn } = require('./middlewares')

const router = express.Router()

try {
  fs.readdirSync('uploads')
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
  fs.mkdirSync('uploads')
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname)
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

// 스스로 해보기 3번 게시글 좋아요 누르기 및 좋아요 취소하기
router.post('/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.body.id } })
    if (post) {
      const result = await post.addLikes(req.user.id)

      cacheUser.change(true)
      res.send('success')
    }
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.post('/dislike', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.body.id } })
    if (post) {
      const result = await post.removeLikes(req.user.id)

      cacheUser.change(true)
      res.send('success')
    }
  } catch (error) {
    console.error(error)
    next(error)
  }
})
// =======================================================

// POST /img 요청시
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file)
  // /img/(파일 이름)을 url에 담아서 전달
  res.json({ url: `/img/${req.file.filename}` })
})

const upload2 = multer()
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user)
    console.log(req.body)
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
      choose1: req.body.choose1,
      choose2: req.body.choose2,
    })
    const hashtags = req.body.content.match(/#[^\s#]*/g)
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        })
      )
      await post.addHashtags(result.map((r) => r[0]))
    }
    res.redirect('/')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

// 스스로 해보기 4번 게시글 삭제
router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({ where: { id: req.params.id } })
    return res.redirect('/')
  } catch (error) {
    // error 발생시 실행
    console.error(error)
    next(error)
  }
})

// 선택 사항 추가
router.post('/choosing', isLoggedIn, async (req, res, next) => {
  try {
    const choose = await Choose.findOne({
      where: { PostId: req.body.postId, UserId: req.body.userId },
    })
    if (!choose) {
      console.log('생성할꺼임!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n')
      const result = await Choose.create({
        UserId: req.body.userId,
        PostId: req.body.postId,
        choose: req.body.choose,
      })
      cacheUser.change(true)
      res.send('success')
    } else {
      console.log('바꿀꺼임~~~~~~~~')
      console.log(req.body.choose)
      await Choose.update(
        {
          choose: req.body.choose,
        },
        {
          where: {
            PostId: req.body.postId,
            UserId: req.body.userId,
          },
        }
      )
      cacheUser.change(true)
      res.send('success')
    }
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router
