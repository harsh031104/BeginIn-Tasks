📝 Student Management API – How to Use with curl.
This API manages students with CRUD operations (Create, Read, Update, Delete).
Server runs on:
               http://localhost:3000
               
1. Start the server

Run the app (example if file is index.js):

node index.js

2. Add a student (POST) :
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Harsh Kumar","email":"harsh@example.com","age":21,"course":"Computer Science"}'

3. List students (GET) :
curl http://localhost:3000/students

4. for update :
curl -X PUT http://localhost:3000/students/3 -H "Content-Type: application/json" -d "{\"name\":\"Updated Student\",\"email\":\"updated@example.com\",\"age\":23,\"course\":\"Mathematics\"}"

5. for delete : 
curl -X DELETE http://localhost:3000/students/1 # for stident id 1
