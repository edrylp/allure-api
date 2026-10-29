const express = require("express");
const orderController = require("../controllers/orderController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Create Order (Checkout) - Non-admin
router.post("/checkout", verify, orderController.createOrder);

// Retrieve Logged-in User Orders
router.get("/my-orders", verify, orderController.retrieveMyOrders);

// Retrieve All Orders (Admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.retrieveAllOrders);

router.get('/:orderId', verify, orderController.getOrderById);

module.exports = router;