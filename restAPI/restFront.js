async function getUser() {
  // 로딩 시 사용자 정보를 가져오는 함수
  try {
    // /users에서 가져오는 json형식을 받아옵니다.
    // get 메서드 호출
    const res = await axios.get('/users')

    // users에 /users에서 받아온 data를 저장합니다.
    const users = res.data

    // id가 list인 태그를 변수 list로 저장
    const list = document.getElementById('list')

    // list의 내용은 빈칸이다.
    list.innerHTML = ''

    // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
    Object.keys(users).map(function (key) {
      // div태그를 가진 userDiv 생성
      const userDiv = document.createElement('div')

      // span태그를 가진 span 생성
      const span = document.createElement('span')
      // span 안에 users의 값들을 넣는다.
      span.textContent = users[key]

      // button 태그를 가진 edit 생성
      const edit = document.createElement('button')
      // edit 안에 '수정' 내용을 넣는다.
      edit.textContent = '수정'

      // 수정 버튼 클릭
      edit.addEventListener('click', async () => {
        // 팝업?창으로 변경 이름 설정
        const name = prompt('바꿀 이름을 입력하세요')
        if (!name) {
          return alert('이름을 반드시 입력하셔야 합니다')
        }

        // /user/에 key값에 맞는 이름을 name으로 바꿔서 넣는다.
        // put 메서드 호출
        try {
          await axios.put('/user/' + key, { name })
          // 다시 함수 시작
          getUser()
        } catch (err) {
          console.error(err)
        }
      })

      // button 태그를 가진 remove 생성
      const remove = document.createElement('button')
      // edit 안에 '삭제' 내용을 넣는다.
      remove.textContent = '삭제'

      // 삭제 버튼 클릭
      remove.addEventListener('click', async () => {
        try {
          // /user/에 key값에 맞는 이름을 삭제
          // delete 메서드 호출
          await axios.delete('/user/' + key)

          // 함수 다시 시작
          getUser()
        } catch (err) {
          console.error(err)
        }
      })

      // list < userDiv < span, edit, remove 이러한 구조로 추가
      userDiv.appendChild(span)
      userDiv.appendChild(edit)
      userDiv.appendChild(remove)
      list.appendChild(userDiv)
      console.log(res.data)
    })
  } catch (err) {
    // 만일 오류가 나오면 catch문을 받아 err를 console에 출력한다.
    console.error(err)
  }
}

window.onload = getUser // 화면 로딩 시 getUser 호출
// 폼 제출(submit) 시 실행
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = e.target.username.value
  if (!name) {
    return alert('이름을 입력하세요')
  }
  try {
    await axios.post('/user', { name })
    getUser()
  } catch (err) {
    console.error(err)
  }
  e.target.username.value = ''
})
