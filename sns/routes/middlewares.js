// 로그인 중이면
exports.isLoggedIn = (req, res, next) => {
  // 만약 로그인 중이면
  if (req.isAuthenticated()) {
    // 다음으로 넘어가기
    next()
  } else {
    // 아니면 '로그인 필요'
    res.status(403).send('로그인 필요')
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  // 만약 로그인 중이 아니면
  if (!req.isAuthenticated()) {
    // 다음으로 넘어간다.
    next()
  } else {
    // 로그인 중면 '로그인한 상태입니다.' error에 보냄
    const message = encodeURIComponent('로그인한 상태입니다.')
    res.redirect(`/?error=${message}`)
  }
}
