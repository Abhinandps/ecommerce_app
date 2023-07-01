const easyinvoice = require('easyinvoice');
const Cart = require("../Models/cartModel");
const Order = require("../Models/orders");
const fs = require("fs");
const Product = require("../Models/products");

exports.generateInvoice = async (order, req, res) => {
  console.log(order.invoiceNumber);

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  const shippingAddress = cart.shippingAddress.find(
    (address) => address._id.toString() === order.shippingAddress.toString()
  );

  if (!shippingAddress) {
    throw new Error("Shipping address not found in the cart");
  }

  const userName = shippingAddress.custName;

  const createdAtString = order.createdAt.toString();

  const createdDate = createdAtString.split("T")[0];

  const products = await Promise.all(
    order.items.map(async (product) => {
      const item = await Product.findById(product.product);
      return {
        quantity: product.quantity,
        description: item.name,
        price: item.price,
      };
    })
  );

  try {
    const templateHtml = fs.readFileSync("template.html", "utf-8");

    const invoice = `<table style="width:300px;">
  <tr>
    <td><b>Invoice Number:</b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Order ID:</b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Order Date:</b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Invoice Date:</b></td>
    <td></td>
  </tr>
</table>`;

    const invoiceHtml = templateHtml.replace("%CUSTOM_INFORMATION%", invoice);

    const updatedInvoiceHtml = invoiceHtml
      .replace("<td></td>", `<td>${order.invoiceNumber}</td>`)
      .replace("<td></td>", `<td>${order.orderID}</td>`)
      .replace("<td></td>", `<td>${createdDate}</td>`)
      .replace("<td></td>", `<td>${createdDate}</td>`);

    

    const invoiceData = {
      customize: {
        template: Buffer.from(updatedInvoiceHtml).toString("base64"),
      },
      images: {
        logo: "https://drive.google.com/uc?export=view&id=1mKOm2uzYLpJrlXuPUEi08j2XEWKpwGMV",
        background: "https://drive.google.com/uc?export=view&id=1HI0YWbWVdABbGRhk9O0RFSD94CASqP8l",
      },
      sender: {
        company: "Anon Stores",
        address: "456 Main Street",
        zip: "54321",
        city: "Bangalore Hub",
        country: "India",
      },
      client: {
        company: `Ship To ${userName}`,
        address: `${shippingAddress.address}`,
        zip: `${shippingAddress.zipCode}`,
        city: `${shippingAddress.city} ${shippingAddress.state}`,
      },
      information: {
        number: `${order.invoiceNumber}`,
        "Order ID": `${order.orderID}`,
        "Order Date": `${order.orderDate}`,
        "Invoice Date": `${createdDate}`,
      },
      products,

      "bottom-notice": "Thankyou For shopping with us.",
      settings: {},
      translate: {},
    };

   

    easyinvoice.createInvoice(invoiceData, (result) => {
      const pdfData = Buffer.from(result.pdf, "base64");

      // Set the appropriate headers for the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice-${order.orderID}.pdf"`
      );

      // Send the PDF data to the client
      res.send(pdfData);
    });
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    throw error;
  }
};
