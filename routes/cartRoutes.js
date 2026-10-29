const express = require("express");
const cartController = require("../controllers/cartController");
const { verify } = require("../auth");

const router = express.Router();

// Retrieve User’s Cart
router.get("/get-cart", verify, cartController.getCart);

// Add To Cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Update Product Quantity in Cart
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Remove From Cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

// Clear Cart
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;