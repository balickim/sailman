// models
const Announcement = require("../models/announcement");
const Category = require("../models/category");
const Tag = require("../models/tag");
const User = require("../models/user");
const Gallery = require("../models/gallery");

// imports
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const sanitizeHtml = require("sanitize-html");
const sharp = require("sharp");

// helpers
const { errorHandler } = require("../helpers/dbErrorHandler");
const { sanitizeHtmlOptions } = require("../helpers/sanitizeHtmlOptions");

// JS
const fs = require("fs");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm({ multiples: true });
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload.",
      });
    }

    const {
      title,
      body,
      categories,
      tags,
      startDate,
      endDate,
      price,
      currency,
      includedInPrice,
      notIncludedInPrice,
      yacht,
      yachtDesc,
      organizer,
      lastMinute,
      tidalCruise,
      language,
      allRoutes,
    } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: "Title is required.",
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "At least one category is required.",
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: "At least one tag is required.",
      });
    }

    if (!startDate || !startDate.length || !endDate || !endDate.length) {
      return res.status(400).json({
        error: "Date can not be empty.",
      });
    }

    let startDateSplit = startDate.split("-");
    let endDateSplit = endDate.split("-");
    let startDateParsed = new Date(
      Number(startDateSplit[0]),
      Number(startDateSplit[1]) - 1,
      Number(startDateSplit[2]) + 1
    );
    let endDateParsed = new Date(
      Number(endDateSplit[0]),
      Number(endDateSplit[1]) - 1,
      Number(endDateSplit[2]) + 1
    );

    let dateNow = new Date(Date.now());

    if (startDateParsed > endDateParsed) {
      return res.status(400).json({
        error: "End date cannot be before start date.",
      });
    }

    if (startDateParsed < dateNow || endDateParsed < dateNow) {
      return res.status(400).json({
        error: "At least one of the dates is in the past.",
      });
    }

    if (!price || !price.length || price < 0) {
      return res.status(400).json({
        error: "Price is required.",
      });
    }

    if (!currency || !currency.length) {
      return res.status(400).json({
        error: "Currency is required.",
      });
    }

    let announcement = new Announcement();
    announcement.title = title;
    announcement.body = sanitizeHtml(body, sanitizeHtmlOptions);
    announcement.startDate = startDate;
    announcement.endDate = endDate;
    announcement.price = price;
    announcement.currency = currency;
    announcement.includedInPrice = JSON.parse(includedInPrice);
    announcement.notIncludedInPrice = JSON.parse(notIncludedInPrice);
    announcement.yacht = yacht;
    announcement.yachtDesc = yachtDesc;
    announcement.organizer = organizer;
    announcement.lastMinute = lastMinute;
    announcement.tidalCruise = tidalCruise;
    announcement.language = language;
    announcement.route = JSON.parse(allRoutes);
    announcement.slug = slugify(title + " " + announcement._id).toLowerCase();
    announcement.mdesc = stripHtml(body.substr(0, 160)).result;
    announcement.postedBy = req.user._id;

    let arrayOfCategories = categories && categories.split(",");
    let arrayOfTags = tags && tags.split(",");

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image size is too big. Max size is 1mb.",
        });
      }

      const data = await sharp(files.photo.path).resize(200).webp().toBuffer();

      announcement.photo.data = data;
      announcement.photo.contentType = "image/webp";
    }

    let gallery;
    if (files.gallery && files.gallery.length) {
      gallery = await addGallery(files.gallery);
    }

    announcement.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      if (files.gallery) {
        Announcement.findByIdAndUpdate(
          result._id,
          { $push: { galleries: gallery._id } },
          { new: true }
        ).exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
        });
      }
      Announcement.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          Announcement.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            } else {
              res.json(result);
            }
          });
        }
      });
    });
  });
};

exports.list = (req, res) => {
  Announcement.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .select("_id, title slug categories tags postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listAllAnnouncementsCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let announcements;
  let categories;
  let tags;

  Announcement.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id, title startDate endDate price currency includedInPrice notIncludedInPrice yacht yachtDesc organizer lastMinute tidalCruise route slug categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      announcements = data;
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        categories = c;
      });
      Tag.find({}).exec((err, t) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        tags = t;

        res.json({
          announcements,
          categories,
          tags,
          size: announcements.length,
        });
      });
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Announcement.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body startDate endDate price currency includedInPrice notIncludedInPrice yacht yachtDesc organizer lastMinute tidalCruise route slug mdesc categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Announcement.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({ message: "Announcement was deleted successfully." });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Announcement.findOne({ slug }).exec((err, oldAnnouncement) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let form = new formidable.IncomingForm({ multiples: true });
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload.",
        });
      }

      fields.body = sanitizeHtml(fields.body, sanitizeHtmlOptions);

      let slugBeforeMerge = oldAnnouncement.slug;
      oldAnnouncement = _.merge(oldAnnouncement, fields);
      oldAnnouncement.slug = slugBeforeMerge;

      const {
        title,
        body,
        categories,
        tags,
        startDate,
        endDate,
        price,
        currency,
        includedInPrice,
        notIncludedInPrice,
        yacht,
        yachtDesc,
        organizer,
        lastMinute,
        tidalCruise,
        allRoutes,
      } = fields;

      if (!title || !title.length) {
        return res.status(400).json({
          error: "Title is required.",
        });
      }

      if (title.length > 70) {
        return res.status(400).json({
          error: "Title is too long.",
        });
      }

      if (!categories || categories.length === 0) {
        return res.status(400).json({
          error: "At least one category is required.",
        });
      }

      if (!tags || tags.length === 0) {
        return res.status(400).json({
          error: "At least one tag is required.",
        });
      }

      if (!startDate || !startDate.length || !endDate || !endDate.length) {
        return res.status(400).json({
          error: "Date can not be empty.",
        });
      }

      let startDateSplit = startDate.split("-");
      let endDateSplit = endDate.split("-");
      let startDateParsed = new Date(
        Number(startDateSplit[0]),
        Number(startDateSplit[1]) - 1,
        Number(startDateSplit[2]) + 1
      );
      let endDateParsed = new Date(
        Number(endDateSplit[0]),
        Number(endDateSplit[1]) - 1,
        Number(endDateSplit[2]) + 1
      );

      if (startDateParsed > endDateParsed) {
        return res.status(400).json({
          error: "End date cannot be before start date.",
        });
      }

      if (!price || !price.length || price < 0) {
        return res.status(400).json({
          error: "Price is required.",
        });
      }

      if (!currency || !currency.length) {
        return res.status(400).json({
          error: "Currency is required.",
        });
      }

      if (yacht.length > 120) {
        return res.status(400).json({
          error: "Yacht field is too long.",
        });
      }

      if (yachtDesc.length > 120) {
        return res.status(400).json({
          error: "Yacht description info field is too long.",
        });
      }

      if (body) {
        oldAnnouncement.mdesc = stripHtml(body.substr(0, 160)).result;
      }

      if (categories) {
        oldAnnouncement.categories = categories.split(",");
      }

      if (tags) {
        oldAnnouncement.tags = tags.split(",");
      }

      if (startDate) {
        oldAnnouncement.startDate = startDate;
      }

      if (endDate) {
        oldAnnouncement.endDate = endDate;
      }

      if (price) {
        oldAnnouncement.price = price;
      }

      if (currency) {
        oldAnnouncement.currency = currency;
      }

      if (includedInPrice) {
        oldAnnouncement.includedInPrice = JSON.parse(includedInPrice);
      }

      if (notIncludedInPrice) {
        oldAnnouncement.notIncludedInPrice = JSON.parse(notIncludedInPrice);
      }

      if (yacht) {
        oldAnnouncement.yacht = yacht;
      }

      if (yachtDesc) {
        oldAnnouncement.yachtDesc = yachtDesc;
      }

      if (organizer) {
        oldAnnouncement.organizer = organizer;
      }

      if (lastMinute) {
        oldAnnouncement.lastMinute = lastMinute;
      }

      if (tidalCruise) {
        oldAnnouncement.tidalCruise = tidalCruise;
      }

      if (allRoutes) {
        oldAnnouncement.route = JSON.parse(allRoutes);
      }

      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "Image size is too big. Max size is 1mb.",
          });
        }
        const data = await sharp(files.photo.path)
          .resize(200)
          .webp()
          .toBuffer();

        oldAnnouncement.photo.data = data;
        oldAnnouncement.photo.contentType = "image/webp";
      }

      let gallery;
      if (files.gallery) {
        if (oldAnnouncement.galleries.length > 0) {
          await Gallery.deleteOne({
            _id: oldAnnouncement.galleries[0],
          });
        }
        gallery = await addGallery(files.gallery);
      }

      if (gallery) {
        oldAnnouncement.galleries = gallery._id;
      }

      oldAnnouncement.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Announcement.findOne({ slug })
    .select("photo")
    .exec((err, announcement) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", announcement.photo.contentType);
      return res.send(announcement.photo.data);
    });
};

exports.galleryCount = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Announcement.findOne({ slug })
    .populate("galleries", "_id data contentType")
    .select("galleries")
    .exec((err, result) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      if (!result.galleries[0]) {
        return res.json({ size: 0 });
      } else {
        return res.json({ size: result.galleries[0].data.length });
      }
    });
};

exports.gallery = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const index = req.params.index ?? 0;
  Announcement.findOne({ slug })
    .populate("galleries", "_id data contentType")
    .select("galleries")
    .exec((err, result) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", result.galleries[0].contentType);
      return res.send(result.galleries[0].data[index]);
    });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.announcement;

  Announcement.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug mdesc postedBy createdAt updatedAt")
    .exec((err, announcements) => {
      if (err) {
        return res.status(400).json({
          error: "Announcements not found",
        });
      }
      res.json(announcements);
    });
};

exports.listSearch = (req, res) => {
  const { search } = req.query;
  if (search) {
    Announcement.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      },
      (err, announcements) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(announcements);
      }
    ).select("-photo -body");
  }
};

exports.listByUser = (req, res) => {
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    let userId = user._id;
    Announcement.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select("_id title slug postedBy")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
  });
};

const addGallery = async (files) => {
  let gallery = new Gallery();

  if (files && files.length) {
    const length = files.length;

    if (length > 10) {
      return res.status(400).json({
        error: "There is more than 10 images.",
      });
    }

    for (let i = 0; i < length; i++) {
      if (files[i].size > 1000000) {
        return res.status(400).json({
          error:
            "At least one of the images from the gallery is too big. Max size is 1mb.",
        });
      }
      gallery.data[i] = await sharp(files[i].path)
        .resize(1000, null, {
          withoutEnlargement: true,
        })
        .webp()
        .toBuffer();
    }
    gallery.contentType = "image/webp";

    await gallery.save();
  }
  return gallery;
};
