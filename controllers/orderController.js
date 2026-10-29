const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create Order (Checkout)
module.exports.createOrder = (req, res) => {
    const userId = req.user.id;
    const { paymentMethod, fullName, email, status } = req.body; 

    return Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(200).send({ message: "Cart not found" });
            }
            if (!cart.cartItems || cart.cartItems.length === 0) {
                return res.status(200).send({ message: "No items to checkout" });
            }

            const newOrder = new Order({
                userId: userId,
                productsOrdered: cart.cartItems,
                totalPrice: cart.totalPrice,
                paymentMethod: paymentMethod || 'mock',
                status: status || 'Pending'
            });

            return newOrder.save().then(order => {
                cart.cartItems = [];
                cart.totalPrice = 0;
                return cart.save().then(() => order);
            });
        })
        .then(order => {
            if (!order) return;
            return res.status(201).send({
                message: "Order placed successfully",
                order: order
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({ message: "Error creating order", error });
        });
};

// Retrieve Logged-in User Orders
module.exports.retrieveMyOrders = (req, res) => {
    const userId = req.user.id;

    return Order.find({ userId })
        .then(orders => {
            if (!orders || orders.length === 0) {
                return res.status(200).send({
                    message: "No orders found"
                });
            }

            return res.status(200).send({
                orders: orders
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({
                message: "Error retrieving orders",
                error: error
            });
        });
};