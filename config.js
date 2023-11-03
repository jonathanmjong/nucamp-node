const dotenv = require("dotenv").config();

module.exports = {
  secretKey: process.env.PASSPORTJWTKEY,
  mongoUrl: process.env.MONGOURI,
};
