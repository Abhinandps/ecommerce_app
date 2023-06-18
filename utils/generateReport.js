const fs = require("fs");
const PDFDocument = require("../utils/pdfkitTables");
const ExcelJS = require("exceljs");

exports.generatePDF = (tableData, res, highlights) => {
  // Create The PDF document
  const doc = new PDFDocument();

  doc.pipe(res);

  doc
    //  .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text(`${highlights.headline}`, 110, 57)
    .fontSize(12)
    .text(`${highlights.date}`)
    .fontSize(10)
    .text(`${highlights.company}`, 200, 65, { align: "right" })
    .text(`${highlights.Address}`, 200, 80, { align: "right" })
    .moveDown();

  // Draw the table
  doc.moveDown().table(tableData, 10, 125, { width: 590 });

  // Finalize the PDF and end the stream
  doc.end();
};

exports.generateCSV = async (tableData, res) => {
  try {
    // Generate the Excel file
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Cancellation Report");

    worksheet.columns = tableData.headers.map((header) => ({
      header,
      key: header,
      width: 20,
    }));

    const data = tableData.rows;

    data.forEach((row) => {
      const rowData = Object.values(row);
      worksheet.addRow(rowData);
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=file.xlsx",
      "Content-Length": excelBuffer.length,
    });

    res.send(excelBuffer); // Send the buffer as the response
  } catch (error) {
    console.error("Error generating Excel content:", error);
    res.status(500).send("Error generating Excel content");
  }
};
