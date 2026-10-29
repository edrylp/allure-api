const express = require("express");
const serviceController = require("../controllers/serviceController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// AUTHENTICATED USER ROUTES
router.get("/me/services", verify, serviceController.getMyServices);
router.post("/me", verify, serviceController.addServiceToProfile);
router.patch("/me/:serviceId", verify, serviceController.updateMyService);
router.patch("/me/:serviceId/toggle", verify, serviceController.toggleMyServiceStatus);
router.delete("/me/:serviceId", verify, serviceController.deleteMyService);

// ADMIN ROUTES
router.get("/admin/all", verify, verifyAdmin, serviceController.adminGetAllServices);
router.delete("/admin/:serviceId", verify, verifyAdmin, serviceController.adminDeleteService);

// PUBLIC ROUTES
router.get("/", serviceController.getAllActiveServices);
router.get("/:serviceId", serviceController.getSingleService);

module.exports = router;