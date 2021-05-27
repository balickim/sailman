const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      min: 200,
      max: 2000000,
      required: true,
    },
    startDate: {
      type: String,
      min: 1,
      max: 20,
      required: true,
    },
    endDate: {
      type: String,
      min: 1,
      max: 20,
      required: true,
    },
    price: {
      type: Number,
    },
    currency: {
      type: String,
      max: 3,
    },
    includedInPrice: {
      type: {},
    },
    notIncludedInPrice: {
      type: {},
    },
    yacht: {
      type: String,
    },
    yachtDesc: {
      type: String,
    },
    organizer: {
      type: String,
    },
    lastMinute: {
      type: Boolean,
    },
    tidalCruise: {
      type: Boolean,
    },
    route: {
      type: {},
      max: 2000000,
    },
    mdesc: {
      type: String,
    },
    language: {
      type: String,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [{ type: ObjectId, ref: "Category", require: true }],
    tags: [{ type: ObjectId, ref: "Tag", require: true }],
    galleries: [{ type: ObjectId, ref: "Gallery" }],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
