const mongoose = require("mongoose");

const salesReportSchema = new mongoose.Schema({
  year: Number,
  salesData: [
    {
      month: String,
      totalSales: {type:Number,default:0},
      topSellingProduct: {
        _id:String,
        name:String,
        totalSales:Number
      },
      revenue: Number,
    },
  ],
});

const SalesReport = mongoose.model("SalesReport", salesReportSchema);

module.exports = SalesReport ;
