module.exports = {
  loadLocaleFrom: (lang, ns) =>
    // You can use a dynamic import, fetch, whatever. You should
    // return a Promise with the JSON file.
    import(`./src/locales/${lang}/${ns}.json`).then(m => m.default),
  locales: ['en', 'pl'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home'],
    '/announcements': ['announcements'],
    '/user/manage/announcement': ['announcements'],
    '/user/manage/[slug]': ['announcements'],
  },
};
