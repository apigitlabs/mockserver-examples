// global state
state.pets = state.pets || []

// generate unique Pet ID 
function uniqueId() {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
}

// description: update a existing pet 
// curl -X 'PUT' \
//   'http://petstore.mock.apigit.com/pet' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "id": 10,
//   "name": "doggie",
//   "category": {
//     "id": 1,
//     "name": "Dogs"
//   },
//   "photoUrls": [
//     "string"
//   ],
//   "tags": [
//     {
//       "id": 0,
//       "name": "string"
//     }
//   ],
//   "status": "available"
// }'
exports.updatePet = function (req, res) {
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
};

// description: Add a new pet to the store
// curl -X 'POST'   'http://petstore.mock.apigit.com/pet'   -H 'Content-Type: application/json' \
//   -d '{
//   "id": 10,
//   "name": "doggie",
//   "category": {
//     "id": 1,
//     "name": "Dogs"
//   },
//   "photoUrls": [
//     "string"
//   ],
//   "tags": [
//     {
//       "id": 0,
//       "name": "string"
//     }
//   ],
//   "status": "available"
// }'
exports.addPet = function (req, res) {
	var pet = req.body;
	
	if (pet.name === "") {
		res.send(405, "Invalid input");
		return;
	}
	
	pet.id = uniqueId(); // generate uniqueID for the new pet
	state.pets.push(pet);

	res.send(200, pet);
};

// description: Finds pets by status
// curl http://980be62vfygro77jw.mock.apigit.com/pet/findbystatus?status=active
exports.findByStatus = function (req, res) {
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
};

// description: find Pet By ID
// curl http://980be62vfygro77jw.mock.apigit.com/pet/2
exports.findByPetId = function (req, res) {
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
};

// description: update a pet by ID
// curl -X 'POST'  'http://petstore.mock.apigit.com/pet/12?name=aa&status=sold'  -H 'accept: */*'  -d ''
exports.upateByPetID = function (req, res) {
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
};

// description: Delete a pet
// curl -X 'DELETE'  'http://petstore.mock.apigit.com/pet/123'   -H 'accept: */*'
exports.deletePet = function (req, res) {
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
};

// description: list all pets
// curl http://980be62vfygro77jw.mock.apigit.com/pet
exports.listPets = function (req, res) {
	res.send(200, state.pets);
};


