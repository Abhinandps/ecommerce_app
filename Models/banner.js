const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  position: {
    type: String,
    enum: ["header", "footer"],
  },
  image: String,
  title: String,
  subTitle: String,
  text: String,
  button: String,
  links: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
