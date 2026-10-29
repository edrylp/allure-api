const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
}