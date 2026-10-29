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