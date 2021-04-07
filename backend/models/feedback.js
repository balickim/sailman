const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const feedbackSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    pathname: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
