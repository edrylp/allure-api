const Product = require("../models/Product");

// Create Product (Admin-only)
module.exports.createProduct = (req, res) => {
    const { name, description, category, icon } = req.body;

    // Basic validation
    if (!name || !description) {
        return res.status(400).send({
            message: "Name and description are required"
        });
    }

    const newProduct = new Product({
        name,
        description,
        category,
        icon
    });

    return newProduct.save()
        .then(createdProduct => {
            return res.status(201).send(createdProduct);
        })
        .catch(error => {
            if (error.code === 11000) {
                return res.status(400).send({
                    message: "A product with this name already exists"
                });
            }
            console.error(error);
            return res.status(500).send({
                message: "Error creating product",
                error: error
            });
        });
};

// Retrieve All Products (Admin-only)
module.exports.getAllProducts = (req, res) => {
    return Product.find({})
        .then(products => {
            return res.status(200).send(products);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error retrieving products",
                error: error
            });
        });
};

// Retrieve All Active Products (Public)
module.exports.getActiveProducts = (req, res) => {
    return Product.find({ isActive: true })
        .then(activeProducts => {
            return res.status(200).send(activeProducts);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error retrieving active products",
                error: error
            });
        });
};

// Retrieve Single Product (Public)
module.exports.getSingleProduct = (req, res) => {
    const { productId } = req.params;

    return Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(200).send(null);
            }

            return res.status(200).send(product);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error retrieving product",
                error: error
            });
        });
};

// Update Product Info (Admin-only)
module.exports.updateProduct = (req, res) => {
    const { productId } = req.params;

    return Product.findByIdAndUpdate(
        productId,
        req.body, 
        { new: true, runValidators: true }
    )
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send({
                    error: "Product not found"
                });
            }

            return res.status(200).send({
                success: true,
                message: "Product updated successfully",
                product: updatedProduct
            });
        })
        .catch(error => {
            if (error.code === 11000) {
                return res.status(400).send({
                    message: "A product with this name already exists"
                });
            }
            console.error(error);
            return res.status(500).send({
                message: "Error updating product",
                error: error
            });
        });
};

// Archive Product (Admin-only)
module.exports.archiveProduct = (req, res) => {
    const { productId } = req.params;

    return Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    error: "Product not found"
                });
            }

            if (product.isActive === false) {
                return res.status(200).send({
                    message: "Product is already archived",
                    product: product
                });
            }

            product.isActive = false;
            return product.save();
        })
        .then(updatedProduct => {
            if (!updatedProduct || updatedProduct.isActive === true) return;

            return res.status(200).send({
                success: true,
                message: "Product archived successfully"
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error archiving product",
                error: error
            });
        });
};
