//
// a simple petstore mock server exampe (all routes should be defined in main.js)
//

// import request handlers
var pet = require("./routes/pet.js")
var store = require("./routes/store.js")
var user = require("./routes/user.js")

// define the routes callback in seperated files
// pet
mock.define("/pet", "PUT", pet.updatePet); // update an existing pet
mock.define("/pet", "POST", pet.addPet); // Add a new pet to the store
mock.define("/pet/findbystatus", "GET", pet.findByStatus); // Find Pets by status
mock.define("/pet/{petId}", "GET", pet.findByPetId);  // Find pet by ID
mock.define("/pet/{petId}", "POST", pet.upateByPetID); // Updates a pet in the store with form data
mock.define("/pet/{petId}", "DELETE", pet.deletePet); // Delete a pet
mock.define("/pet", "GET", pet.listPets); // list all poets

//store
mock.define("/store/inventory", "GET", store.getInventory); // Return pet inventory by status
mock.define("/store/order", "POST", store.addOrder); // Place an order for a pet
mock.define("/store/order", "GET", store.listOrders); // list all purchase orders
mock.define("/store/order/{orderId}", "GET", store.findOrderById); // Find purchase order by ID
mock.define("/store/order/{orderId}", "DELETE", store.deleteOrder);  // Delete purchase order by ID

//user
mock.define("/user", "POST", user.createUser); // create a user
mock.define("/user", "GET", user.listUsers); // list all users
mock.define("/user/login", "GET", user.logIn); // login user
mock.define("/user/logout", "GET", user.logOut); // logout user
mock.define("/user/createWithList", "POST", user.createWithList); // create a list of users
mock.define("/user/{username}", "GET", user.findByName); // find user by name
mock.define("/user/{username}", "PUT", user.updateUser); // updte user by name
mock.define("/user/{username}", "DELETE", user.deleteUser);  // delete a user


// an api to get state
mock.define("/state", "GET", function (req, res) { 
  return res.json(state || {})
 }); 

// an api to clear state
 mock.define("/clean", "GET", function (req, res) { 
  state.pets = [];
  state.users = [];
  state.orders = [];
  return res.json(state)
 }); 
 
mock.define("/hello/world", "GET", function (req, res) { 
  var users = [ 
    { username: "hello", email: "hello@gmail.com" },
    { username: "world", email: "world@gmail.com" }
  ]

  return res.json(users)
 }); 

 mock.define("/", "GET", function (req, res) { 
	res.send(200, "welcome to apigit mock server");
 }); 



