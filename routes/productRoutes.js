const express = require("express");
const productController = require("../controllers/productController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Create Product (Admin only)
router.post("/", verify, verifyAdmin, productController.createProduct);

// Retrieve all products (Admin only)
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Retrieve all active products (Public)
router.get("/active", productController.getActiveProducts);

// Retrieve single product (Public)
router.get("/:productId", productController.getSingleProduct);

// Update product info (Admin only)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// Archive product (Admin only)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Activate product (Admin only)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Search product by name (public)
router.post("/search-by-name", productController.searchProduct);

// Search product by price range (public)
router.post("/search-by-price", productController.searchByPrice);

module.exports = router;