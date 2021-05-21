const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  data: {
    type: [Buffer],
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Gallery", gallerySchema);
