const Cart = require("../models/Cart");

// Retrieve User’s Cart
module.exports.getCart = (req, res) => {
    const userId = req.user.id;
    return Cart.findOne({ userId })
        .populate({
            path: 'cartItems.productId',
            model: 'UserService',
            populate: [
                {
                    path: 'providerId',
                    model: 'User',
                    select: 'firstName lastName profileImage'
                },
                {
                    path: 'serviceTypeId',
                    model: 'Product',
                    select: 'name description'
                }
            ]
        })
        .then(cart => {
            if (!cart) {
                return res.status(200).send({ message: "Cart not found" });
            }
            return res.status(200).send(cart);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({ message: "Error retrieving cart", error });
        });
};

// Add To Cart
module.exports.addToCart = (req, res) => {
    const userId = req.user.id;
    const { productId, price, quantity, subtotal } = req.body;

    if (!productId || !price || !quantity || !subtotal) {
        return res.status(400).send({
            message: "All fields are required"
        });
    }

    return Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                const newCart = new Cart({
                    userId,
                    cartItems: [{ productId, quantity, subtotal }],
                    totalPrice: subtotal
                });
                return newCart.save();
            }

            // Check if item already exists in cart
            const existingItem = cart.cartItems.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                const pricePerItem = existingItem.subtotal / existingItem.quantity;
                existingItem.quantity += quantity;
                existingItem.subtotal += pricePerItem * quantity;
            } else {
                cart.cartItems.push({ productId, quantity, subtotal });
            }

            cart.totalPrice = cart.cartItems.reduce(
                (total, item) => total + item.subtotal, 0
            );

            return cart.save();
        })
        .then(updatedCart => {
            return res.status(200).send(updatedCart);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error adding to cart",
                error: error
            });
        });
};

// Update Product Quantity in Cart
module.exports.updateCartQuantity = (req, res) => {
    const userId = req.user.id;
    const { productId, newQuantity } = req.body;

    if (!productId || !newQuantity) {
        return res.status(400).send({
            message: "Product ID and new quantity are required"
        });
    }

    return Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(200).send({
                    message: "Cart not found"
                });
            }

            const itemIndex = cart.cartItems.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex === -1) {
                return res.status(200).send({
                    message: "Item not found in cart"
                });
            }

            const item = cart.cartItems[itemIndex];
            const pricePerItem = item.subtotal / item.quantity;

            item.quantity = newQuantity;
            item.subtotal = pricePerItem * newQuantity;

            cart.totalPrice = cart.cartItems.reduce(
                (total, item) => total + item.subtotal,
                0
            );

            return cart.save();
        })
        .then(updatedCart => {
            if (!updatedCart || updatedCart.message) return;

            return res.status(200).send({
                message: "Cart updated successfully",
                cart: updatedCart
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error updating cart",
                error: error
            });
        });
};