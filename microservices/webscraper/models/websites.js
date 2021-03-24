const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  link: {
    type: String,
  },
  siteUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Website", websiteSchema);
