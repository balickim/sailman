const WaterReservoir = require('../models/waterreservoir');
const { errorHandler } = require("../helpers/dbErrorHandler");

// singular lake 
exports.create = (req, res) => {
  let { continent, country, reservoir } = req.body;
  let lake = new WaterReservoir({ continent, country, reservoir });

  lake.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    } else {
      res.json(data)
    }
  })
}

exports.createAll = (req, res) => {
  // res.body => [{cont, count, lake}, ...]
  for (let i of req.body) {
    let { continent, country, reservoir } = i;
    let lake = new WaterReservoir({ continent, country, reservoir });

    lake.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      } else {
        // continue untill all have been added
      }
    })
  }
  res.json({
    great: "success"
  })
}

exports.listAll = (req, res) => {
  // no body, lists all water reservoirs available
  WaterReservoir.find({}, "continent country reservoir").exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    } else {
      res.json(data)
    }
  })
}

exports.findReservoirs = (req, res) => {

  let { slug } = req.body;
  WaterReservoir.find({
    $or: [
      { reservoir: { $regex: `.*${slug}.*`, $options: 'i' } },
      { continent: { $regex: `.*${slug}.*`, $options: 'i' } },
      { country: { $regex: `.*${slug}.*`, $options: 'i' } },
    ]
  })
    .limit(7)
    .exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    } else {
      res.json(data)
    }
  });
}