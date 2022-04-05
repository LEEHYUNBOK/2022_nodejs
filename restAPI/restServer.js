const http = require('http')
const fs = require('fs').promises

// users의 내용을 저장하기 위한 변수 users
const users = {}

http
  .createServer(async (req, res) => {
    try {
      // 어떤 method로 실행되고 어디 url에서 왔는지 log 찍기
      console.log(req.method, req.url)

      // GET이면
      if (req.method === 'GET') {
        // / 주소일 때
        if (req.url === '/') {
          // restFront.html 읽어서 data에 넣는다.
          const data = await fs.readFile('./restFront.html')
          // 헤더 정보 내보내기
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

          // res data 넣고 출력, 컨텐츠 출력 완료(응답 종료)
          return res.end(data)
        }
        // /about 주소일 때
        else if (req.url === '/about') {
          const data = await fs.readFile('./about.html')
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          return res.end(data)
        }
        // /users 주소일 때
        else if (req.url === '/users') {
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
          // res에 users 데이터 json 형식으로 넣고 출력, 컨텐츠 출력 완료(응답 종료)
          return res.end(JSON.stringify(users))
        }
        // 주소가 /도 /about도 /users도 아니면
        try {
          // req의 url을 data에 넣고 return
          const data = await fs.readFile(`.${req.url}`)
          return res.end(data)
        } catch (err) {
          //주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
        }
      }
      // POST이면
      else if (req.method === 'POST') {
        // /users 주소일 때
        if (req.url === '/user') {
          let body = ''
          // 요청의 body를 stream 형식으로 받음

          req.on('data', (data) => {
            body += data
          })
          // 요청의 body를 다 받은 후 실행됨
          return req.on('end', () => {
            // 요청 받은 body log 출력
            console.log('POST 본문(Body):', body)
            // body를 name 변수에 저장
            const { name } = JSON.parse(body)
            // id는 지금 시간
            const id = Date.now()
            // users의 id 번째에 name 저장
            users[id] = name
            res.writeHead(201)
            res.end('등록 성공')
          })
        }
      }
      // PUT이면
      else if (req.method === 'PUT') {
        // url이 /user/로 시작하면
        if (req.url.startsWith('/user/')) {
          // url을 '/' 기준으로 끊고 2번째 있는 값 key에 저장, 즉 user id 값을 key에 저장
          const key = req.url.split('/')[2]
          let body = ''
          // 요청의 body를 stream 형식으로 받음
          req.on('data', (data) => {
            body += data
          })

          // users[key]에 body의 name을 넣는다.
          return req.on('end', () => {
            console.log('PUT 본문(Body):', body)
            users[key] = JSON.parse(body).name
            // return users
            return res.end(JSON.stringify(users))
          })
        }
      }
      // DELETE이면
      else if (req.method === 'DELETE') {
        // url이 /user/로 시작하면
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2]
          // user[key] 삭제
          delete users[key]
          return res.end(JSON.stringify(users))
        }
      }

      // get, push, put, delete 이중 아무것도 안걸리면
      res.writeHead(404)
      return res.end('NOT FOUND')
    } catch (err) {
      console.error(err)
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(err.message)
    }
  })
  .listen(8082, () => {
    // 8082 포트 시작시
    console.log('8082번 포트에서 서버 대기 중입니다.')
  })
