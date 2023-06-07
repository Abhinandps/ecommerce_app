const mongoose = require("mongoose");

const salesReportSchema = new mongoose.Schema({
  year: Number,
  salesData: [
    {
      month: String,
      totalSales: Number,
      topSellingProduct: String,
      revenue: Number,
    },
  ],
});

const SalesReport = mongoose.model("SalesReport", salesReportSchema);

module.exports = SalesReport ;
