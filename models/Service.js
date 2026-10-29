const mongoose = require("mongoose");

const userServiceSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Provider is required"]
    },
    serviceTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Service type is required"]
    },
    customDescription: {
        type: String,
        required: false,
        default: "" 
    },
    icon: {
        type: String,
        required: false,
        default: ""
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    duration: {
        type: Number,
        required: false
    },

    availabilityNotes: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

userServiceSchema.index({ providerId: 1, serviceTypeId: 1 }, { unique: true });
userServiceSchema.index({ providerId: 1, isActive: 1 });

module.exports = mongoose.model("UserService", userServiceSchema);