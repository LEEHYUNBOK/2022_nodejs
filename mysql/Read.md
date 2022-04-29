http://localhost:3001/ 접속시
 1. html => node
    정보 요청
 2. node => mysql
    GET / 주소 실행 후 시퀄라이즈 findAll메소드 호출하여 mysql에 요청
 3. mysql => node 
    mysql 의 users table의 정보 응답
 4. node => html
    users의 정보 출력


user 입력시
 1. html => node
    user-form 의 submit 누르면 user-form 정보 전송
 3. node => mysql 
    POST /user 주소로 실행 후 시퀄라이즈 create메소드 호출하여 mysql에 저장
 4. mysql => node
    mysql에 저장
 5. node => mysql
    GET /user 주소 실행 후 user의 시퀄라이즈 findAll메소드 호출하여 mysql에 요청
 6. mysql => node 
    mysql 의 users table의 정보 응답
 7. node => html
    users의 정보 출력


user 클릭 시
 1. html => node
    user table 태그를 클릭 시
 2. node => mysql 
    html 에서 받은 id 값을 GET /users/${id}/comments 주소 실행 후 comment의 시퀄라이즈 findAll메소드 호출하여 mysql에 요청
 3. mysql => node 
    mysql 의 comment table의 정보 응답
 4. node => html
    comments의 정보 출력

댓글 작성 시
 1. html => node
    comment-form 의 submit 누르면 정보 전송
 2. node => mysql 
    POST /comments 주소로 실행 후 comment의 시퀄라이즈 create 메소드 호출하여 mysql에 저장
 3. mysql => node
     mysql 의 comment table의 정보 응답
 4. node => mysql
    GET /users/${id}/comments 주소 실행 후 comment의 시퀄라이즈 findAll 메소드 호출하여 mysql에 요청
 5. mysql => node 
    mysql 의 comment table의 정보 응답
 6. node => html
    comments의 정보 출력


댓글 삭제 시
 1. html => node
    삭제 버튼을 클릭
 2. node => mysql 
    DELETE /comments/${comment.id} 주소로 실행 후 comment의 시퀄라이즈 destroy 메소드 호출하여 mysql에 요청
 3. mysql => node
    mysql 의 comment table의 정보 응답
 4. node => mysql
    GET /users/${id}/comments 주소 실행 후 comment의 시퀄라이즈 findAll 메소드 호출하여 mysql에 요청
 5. mysql => node 
    mysql 의 comment table의 정보 응답
 6. node => html
    comments의 정보 출력


댓글 수정 시
 1. html => node
    삭제 버튼을 클릭
 2. node => mysql 
    PATCH /comments/${comment.id} 주소로 실행 후 comment의 시퀄라이즈 update 메소드 호출하여 mysql에 요청
 3. mysql => node
    mysql 의 comment table의 정보 응답
 4. node => mysql
    GET /users/${id}/comments 주소 실행 후 comment의 시퀄라이즈 findAll 메소드 호출하여 mysql에 요청
 5. mysql => node 
    mysql 의 comment table의 정보 응답
 6. node => html
    comments의 정보 출력
