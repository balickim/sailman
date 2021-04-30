const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["localhost"],
  },
  future: {
    webpack5: true,
  },
};
