// global state
state.orders = state.orders || []
// generate unique Pet ID 
function uniqueId() {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
}

// description: Return pet inventories by status
//curl -X 'GET'  'http://petstore.mock.apigit.com/store/inventory'  -H 'accept: application/json'
exports.getInventory = function (req, res) {
	var inventory = {
		approved: 7,
		placed: 4,
		delivered: 50,
	};

	res.send(200, inventory);
};


// description: Place an Order for a pet
// curl -X 'POST' \
//   'http://petstore.mock.apigit.com/store/order' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "id": 11,
//   "petId": 198772,
//   "quantity": 7,
//   "shipDate": "2023-01-14T19:25:54.211Z",
//   "status": "approved",
//   "complete": true
// }'
exports.addOrder = function (req, res) {
	var order = req.body;
	
	if (order.petId === "") {
		res.send(405, "Invalid input");
		return;
	}

	order.id = uniqueId();
	
	state.orders.push(order);
	res.send(200, order);
};

// description: get purchase order By ID
// curl -X 'GET'  'http://petstore.mock.apigit.com/store/order/11'   -H 'accept: application/json'
exports.findOrderById = function (req, res) {
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
};



// description: Delete purchase order by ID
// curl -X 'DELETE'  'http://petstore.mock.apigit.com/store/order/10'   -H 'accept: */*'
exports.deleteOrder = function (req, res) {
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
};

// description: list all orders
// curl http://980be62vfygro77jw.mock.apigit.com/store/order
exports.listOrders = function (req, res) {
	res.send(200, state.orders);
};


