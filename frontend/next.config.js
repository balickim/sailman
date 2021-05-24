const nextTranslate = require('next-translate');
// const withPWA = require("next-pwa");
// const runtimeCaching = require("next-pwa/cache");

// module.exports = withPWA({
module.exports = {
  ...nextTranslate(),
  // pwa: {
  //   dest: "public",
  //   runtimeCaching,
  // },
  images: {
    domains: [process.env.NEXT_PUBLIC_DOMAIN],
  },
  future: {
    webpack5: true,
  },
};
