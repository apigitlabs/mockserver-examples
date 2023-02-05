//
// a simple petstore mock server exampe (all routes should be defined in main.js)
//

// global state
state.pets = state.pets || []
state.orders = state.orders || []
state.users = state.users || []

// generate unique Pet ID 
function uniqueId() {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
}

///////////////////// state ///////////////////
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

///////////////////// pet ///////////////////
// update an existing pet
mock.define("/pet", "PUT", function (req, res) {
	var pets = state.pets || [];
	var pet = req.body;
	var i = 0;

	for (i = 0; i < pets.length; i++) {
		if (pets[i].id == pet.id) {
			pets[i] = pet;
			state.pets = pets;
			break;
		}
	}

	if (i === pets.length) { // menas not found the pet
		res.send(404, 'Pet not found');
		return;
	}

	res.send(200, pet);
}); 

// Add a new pet to the store
mock.define("/pet", "POST", function (req, res) {
	var pet = req.body;
	
	if (pet.name === "") {
		res.send(405, "Invalid input");
		return;
	}
	
	pet.id = uniqueId(); // generate uniqueID for the new pet
	state.pets.push(pet);

	res.send(200, pet);
}); 

// Find Pets by status
mock.define("/pet/findbystatus", "GET", function (req, res) {
	var pets = [];

	if (req.query.status !== "available" && req.query.status !== "pending" && req.query.status !== "sold") {
		res.send(400, "Invalid status value");
		return;
	}

	for (var i = 0; i < state.pets.length; i++) {
		if (state.pets[i].status == req.query.status) {
			pets.push(state.pets[i]);
		}
	}

	res.send(200, pets);
}); 

// Find pet by ID
mock.define("/pet/{petId}", "GET", function (req, res) {
	var pet = null;

	if (!req.params.petId || req.params.petId === "") {
		res.send(400, "Invalid ID supplied");
		return;
	}

	for (var i = 0; i < state.pets.length; i++) {
		if (state.pets[i].id == req.params.petId) {
			pet = state.pets[i];
			break;
		}
	}

	if (pet === null) { // not found the pet
		res.send(404, "Pet not found");
		return;
	}

	res.send(200, pet);
});  

// Updates a pet in the store with form data
mock.define("/pet/{petId}", "POST", function (req, res) {
	var pets = state.pets || [];
	var pet = req.body;
	var i = 0;

	if (req.query.name && req.query.name === "") {
		res.send(405, "Invalid Input");
		return;
	}

	if (req.query.status && req.query.status !== "available" && req.query.status !== "sold" && req.query.status !== "pending") {
		res.send(405, "Invalid Input");
		return;
	}
	
	for (i = 0; i < pets.length; i++) {
		if (pets[i].id == req.params.petId) {
			if (req.query.name) {
				pets[i].name = req.query.name;
			}

			if (req.query.status) {
				pets[i].status = req.query.status;
			}

			state.pets = pets;
			res.send(200, pets[i]);
			return;
		}
	}

	res.send(404, 'Pet not found');
	return;
}); 

// Delete a pet
mock.define("/pet/{petId}", "DELETE", function (req, res) {
	var pets = state.pets || [];

	for (var i = 0; i < pets.length; i++) {
		if (pets[i].id == req.params.petId) {
			pets.splice(i, 1);
			state.pets = pets;
			res.send(200, "Pet deleted");
			return;
		}
	}

	res.send(400, "Invalid pet value");
}); 

// list all poets
mock.define("/pet", "GET", function (req, res) {
	res.send(200, state.pets);
}); 

/////////////////// store /////////////////////
// Return pet inventory by status
mock.define("/store/inventory", "GET", function (req, res) {
	var inventory = {
		approved: 7,
		placed: 4,
		delivered: 50,
	};

	res.send(200, inventory);
}); 

// Place an order for a pet
mock.define("/store/order", "POST", function (req, res) {
	var order = req.body;
	
	if (order.petId === "") {
		res.send(405, "Invalid input");
		return;
	}

	order.id = uniqueId();
	
	state.orders.push(order);
	res.send(200, order);
}); 

// list all purchase orders
mock.define("/store/order", "GET", function (req, res) {
	res.send(200, state.orders);
}); 

// Find purchase order by ID
mock.define("/store/order/{orderId}", "GET", function (req, res) {
	var order = null;

	if (!req.params.orderId || req.params.orderId === "") {
		res.send(400, "Invalid ID supplied");
		return;
	}

	for (var i = 0; i < state.orders.length; i++) {
		if (state.orders[i].id == req.params.orderId) {
			order = state.orders[i];
			break;
		}
	}

	if (order === null) { // not found the order
		res.send(404, "Order not found");
		return;
	}

	res.send(200, order);
}); 

// Delete purchase order by ID
mock.define("/store/order/{orderId}", "DELETE", function (req, res) {
	var orders = state.orders || [];

	if (!req.params.orderId || req.params.orderId === "") {
		res.send(400, "Invalid ID supplied");
		return;
	}

	for (var i = 0; i < orders.length; i++) {
		if (orders[i].id == req.params.orderId) {
			orders.splice(i, 1);
			state.orders = orders;
			res.send(200, "Order deleted");
			return;
		}
	}

	res.send(404, "Order not found");
});  

////////////////////// user ///////////////////////
// create a user
mock.define("/user", "POST", function (req, res) {
	var user = req.body;
	
	if (user.username === "") {
		res.send(405, "Invalid input");
		return;
	}
	
	user.id = uniqueId(); // generate uniqueID for the new user
	state.users.push(user);

	res.send(200, user);
}); 

// list all users
mock.define("/user", "GET", function (req, res) {
	res.send(200, state.users);
	return;
}); 

// login user
mock.define("/user/login", "GET", function (req, res) {
	req = req;
	res.send(200, "loged in user");
	return;
	// res.send(400, "Invalid username/password supplied");
}); 

// logout user
mock.define("/user/logout", "GET", function (req, res) {
	req = req;
	res.send(200, "loged out user");
	return;
}); 

// create a list of users
mock.define("/user/createWithList", "POST", function (req, res) {
	var stateUsers = state.users;
	var users = req.body;
	
	
	for (var i = 0; i < users.length; i++) {
		if (users[i].username === "") {
			res.send(405, "Invalid input");
			return;
		}

		users[i].id = uniqueId(); // generate uniqueID for the new user
		stateUsers.push(users[i]);
	}

	state.users = stateUsers;

	res.send(200, users);
}); 

// find user by name
mock.define("/user/{username}", "GET", function (req, res) {
	var user = null;

	for (var i = 0; i < state.users.length; i++) {
		if (state.users[i].username == req.params.username) {
			user = state.users[i];
			break;
		}
	}

	if (user === null) {
		res.send(404, "User not found");
		return;
	}

	res.send(200, user);
}); 

// updte user by name
mock.define("/user/{username}", "PUT", function (req, res) {
	var users = state.users || [];
	var user = req.body;
	var i = 0;

	if (user.name === "") {
		res.send(405, "Invalid Input");
		return;
	}
	
	for (i = 0; i < users.length; i++) {
		if (users[i].username == req.params.username) {
			if (users[i].id === user.id) {
				users[i] = user;
				state.users = users;
				res.send(200, user);
				return;
			} else {
				res.send(405, "Invalid Input");
				return;
			}
		}
	}

	res.send(404, 'User not found');
	return;
}); 

// delete a user
mock.define("/user/{username}", "DELETE", function (req, res) {
	var users = state.users || [];

	if (req.params.username === "") {
		res.send(400, "Invalid username supplied.");
		return;
	}
	
	for (var i = 0; i < users.length; i++) {
		if (users[i].username == req.params.username) {
			users.splice(i, 1);
			state.users = users;
			res.send(200, "User deleted");
			return;
		}
	}

	res.send(404, "User not found");
});  

////////////////////////// MISC //////////////////////////////////
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
 

