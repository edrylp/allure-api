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