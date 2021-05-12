const User = require("../models/user");

let userData = {
  name: "Admin",
  username: "Administrator",
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
  profile: `${process.env.CLIENT_URL}/profile/Administrator`,
};

const user = new User(userData);

user.save((err, user) => {
  if (err && err.code !== 11000) {
    console.log(err);
    console.log(err.code);
    return;
  }
  if (err && err.code === 11000) {
    return;
  }
});
