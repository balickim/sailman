const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: [process.env.NEXT_PUBLIC_DOMAIN],
  },
  future: {
    webpack5: true,
  },
};
