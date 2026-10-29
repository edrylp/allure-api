const UserService = require("../models/Service");
const ServiceType = require("../models/Product");
const User = require("../models/User");

// Add Service to Profile
module.exports.addServiceToProfile = (req, res) => {
    const { serviceTypeId, customDescription, price, duration, availabilityNotes, icon } = req.body;

  if (!serviceTypeId || !price) {
    return res.status(400).send({
      message: "Service type and price are required",
    });
  }

  return ServiceType.findOne({ _id: serviceTypeId, isActive: true })
    .then((serviceType) => {
      if (!serviceType) {
        return res.status(404).send({
          message: "Service type not found or is not active",
        });
      }

      const newUserService = new UserService({
        providerId: req.user.id,
        serviceTypeId,
        customDescription,
        price,
        duration,
        availabilityNotes,
        icon
      });

      return newUserService.save();
    })
    .then((userService) => {
      if (!userService) return;

      return res.status(201).send({
        message: "Service added to your profile successfully",
        service: userService,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).send({
          message: "You already offer this service type. Update it instead.",
        });
      }

      console.error(error);
      return res.status(500).send({
        message: "Error adding service to profile",
        error,
      });
    });
};

// Get Services
module.exports.getMyServices = (req, res) => {
  return UserService.find({ providerId: req.user.id })
    .populate("serviceTypeId", "name description category icon")
    .sort({ createdOn: -1 })
    .then((services) => res.status(200).send(services))
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        message: "Error retrieving your services",
        error,
      });
    });
};

// USER - Update Own Service
module.exports.updateMyService = (req, res) => {
  const { serviceId } = req.params;
  const { customDescription, price, duration, availabilityNotes, icon } = req.body;

  return UserService.findOne({ _id: serviceId, providerId: req.user.id })
    .then((service) => {
      if (!service) {
        return res.status(404).send({
          message: "Service not found or you don't have permission to update it",
        });
      }

      if (customDescription !== undefined) service.customDescription = customDescription;
      if (price !== undefined) service.price = price;
      if (duration !== undefined) service.duration = duration;
      if (availabilityNotes !== undefined) service.availabilityNotes = availabilityNotes;
      if (icon !== undefined) service.icon = icon;

      return service.save();
    })
    .then((updatedService) => {
      if (!updatedService) return;

      return res.status(200).send({
        message: "Service updated successfully",
        service: updatedService,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        message: "Error updating service",
        error,
      });
    });
};

// USER - Toggle Own Service Status
module.exports.toggleMyServiceStatus = (req, res) => {
  const { serviceId } = req.params;

  return UserService.findOne({ _id: serviceId, providerId: req.user.id })
    .then((service) => {
      if (!service) {
        return res.status(404).send({
          message: "Service not found or you don't have permission",
        });
      }

      service.isActive = !service.isActive;
      return service.save();
    })
    .then((updatedService) => {
      if (!updatedService) return;

      return res.status(200).send({
        message: `Service ${updatedService.isActive ? "activated" : "deactivated"} successfully`,
        service: updatedService,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        message: "Error updating service status",
        error,
      });
    });
};