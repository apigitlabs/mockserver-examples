// global state

// generate unique Pet ID 
function uniqueId() {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
}

// description: Create User
// curl -X 'POST' \
//   'http://petstore.mock.apigit.com/user' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "username": "theUser",
//   "firstName": "John",
//   "lastName": "James",
//   "email": "john@email.com",
//   "password": "12345",
//   "phone": "12345",
//   "userStatus": 1
// }'
exports.createUser = ;

// description: Create list of users with given input array
// curl -X 'POST' \
//   'http://petstore.mock.apigit.com/user/createWithList' \
//   -H 'accept: application/xml' \
//   -H 'Content-Type: application/json' \
//   -d '[
//   {
//     "id": 10,
//     "username": "theUser",
//     "firstName": "John",
//     "lastName": "James",
//     "email": "john@email.com",
//     "password": "12345",
//     "phone": "12345",
//     "userStatus": 1
//   }
// ]'
exports.createWithList = ;

// description: login user
// curl -X 'GET' \
//   'http://petstore.mock.apigit.com/user/login?username=jim&password=abcdefg' \
//   -H 'accept: application/json'
exports.logIn = ;


// description: logout user
// curl -X 'GET' \
//   'http://petstore.mock.apigit.com/user/logout' \
//   -H 'accept: */*'
exports.logOut = ;


// description: Get user by username
// curl -X 'GET' \
//   'http://petstore.mock.apigit.com/user/jim' \
//   -H 'accept: application/json'
exports.findByName = ;


// description: update user
// curl -X 'PUT' \
//   'http://petstore.mock.apigit.com/user/theUser' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "id": 10,
//   "username": "theUser",
//   "firstName": "John",
//   "lastName": "James",
//   "email": "john@email.com",
//   "password": "12345",
//   "phone": "12345",
//   "userStatus": 1
// }'

exports.updateUser = ;

// description: Delete a user
// curl -X 'DELETE' \
//   'http://petstore.mock.apigit.com/user/adfadf' \
//   -H 'accept: */*'
exports.deleteUser = ;

// description: list all users
// curl http://980be62vfygro77jw.mock.apigit.com/user
exports.listUsers = ;


