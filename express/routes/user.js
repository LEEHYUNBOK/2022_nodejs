const express = require('express')

const router = express.Router()

// GET /user 라우터
router.get('/', (req, res) => {
  res.send('Hello, User')
})

router.get('/:id', function (req, res) {
  console.log(req.params, req.query)
  res.send('hello, ID')
})

module.exports = router
