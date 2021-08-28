const express = require("express");
const router = express.Router();

const { create, createAll, findReservoirs, listAll } = require("../controllers/waterreservoir");
const { isAuthenticated, isAuthorized } = require("../controllers/auth");

// these should not be able to be called by users (i think)
router.post(
	"/water_reservoir",
	create
);
router.post(
	"/water_reservoirs",
	createAll
)

// this one must be
router.post(
	"/find_water_reservoir",
	findReservoirs
)

// this one i dont know
router.get(
	"/water_reservoirs",
	listAll
)

module.exports = router;