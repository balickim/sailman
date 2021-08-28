const mongoose = require("mongoose");

const waterReservoirSchema = new mongoose.Schema(
	{
		continent: {
			type: String,
			required: true,
			trim: true,
		},
		country: {
			type: String,
			required: true,
			trim: true,
		},
		reservoir: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("WaterReservoir", waterReservoirSchema);