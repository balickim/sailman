// models
const Announcement = require("../models/announcement");
const Category = require("../models/category");
const Tag = require("../models/tag");
const User = require("../models/user");

// imports
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const sanitizeHtml = require("sanitize-html");
const { sanitizeHtmlOptions } = require("../helpers/sanitizeHtmlOptions");

// helpers
const { errorHandler } = require("../helpers/dbErrorHandler");
const { smartTrim } = require("../helpers/announcement");

// JS
const fs = require("fs");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
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
      days,
      price,
      currency,
      includedInPrice,
      yacht,
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

    if (!body || body.length < 100) {
      return res.status(400).json({
        error: "Content must be at least 100 characters.",
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

    if (!days || !days.length) {
      return res.status(400).json({
        error: "Days are required.",
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
    announcement.days = days;
    announcement.price = price;
    announcement.currency = currency;
    announcement.includedInPrice = includedInPrice;
    announcement.yacht = yacht;
    announcement.lastMinute = lastMinute;
    announcement.tidalCruise = tidalCruise;
    announcement.language = language;
    announcement.route = JSON.parse(allRoutes);
    announcement.excerpt = smartTrim(
      sanitizeHtml(body, sanitizeHtmlOptions),
      320,
      " ",
      "..."
    );
    announcement.slug = slugify(title).toLowerCase();
    announcement.mtitle = `${title} - ${process.env.APP_NAME}`;
    announcement.mdesc = stripHtml(body.substr(0, 160)).result;
    announcement.postedBy = req.user._id;

    let arrayOfCategories = categories && categories.split(",");
    let arrayOfTags = tags && tags.split(",");

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image size is too big. Max size is 1mb.",
        });
      }

      announcement.photo.data = fs.readFileSync(files.photo.path);
      announcement.photo.contentType = files.photo.type;
    }

    announcement.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
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
    .select(
      "_id, title slug excerpt categories tags postedBy createdAt updatedAt"
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
      "_id, title startDate endDate days price currency includedInPrice yacht lastMinute tidalCruise route slug excerpt categories tags postedBy createdAt updatedAt"
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
      "_id title body startDate endDate days price currency includedInPrice yacht lastMinute tidalCruise route slug mtitle mdesc categories tags postedBy createdAt updatedAt"
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

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
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
        desc,
        categories,
        tags,
        startDate,
        endDate,
        days,
        price,
        currency,
        includedInPrice,
        yacht,
        lastMinute,
        tidalCruise,
        allRoutes,
      } = fields;

      if (!title || !title.length) {
        return res.status(400).json({
          error: "Title is required.",
        });
      }

      if (!body || body.length < 100) {
        return res.status(400).json({
          error: "Content must be at least 100 characters.",
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

      if (!days || !days.length) {
        return res.status(400).json({
          error: "Days are required.",
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

      if (body) {
        oldAnnouncement.excerpt = smartTrim(
          sanitizeHtml(body, sanitizeHtmlOptions),
          320,
          " ",
          "..."
        );
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

      if (days) {
        oldAnnouncement.days = days;
      }

      if (price) {
        oldAnnouncement.price = price;
      }

      if (currency) {
        oldAnnouncement.currency = currency;
      }

      if (includedInPrice) {
        oldAnnouncement.includedInPrice = includedInPrice;
      }

      if (yacht) {
        oldAnnouncement.yacht = yacht;
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
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: "Image size is too big. Max size is 1mb.",
          });
        }

        oldAnnouncement.photo.data = fs.readFileSync(files.photo.path);
        oldAnnouncement.photo.contentType = files.photo.type;
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

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.announcement;

  Announcement.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
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
