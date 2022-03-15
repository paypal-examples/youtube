import "dotenv/config"; // loads variables from .env file
import express from "express";
import sendgrid from "@sendgrid/mail";
import { readFile } from "fs/promises";
import * as paypal from "./paypal-api.js";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(express.static("public"));

app.post("/api/orders", async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  if (
    captureData.status === "COMPLETED" &&
    captureData.purchase_units[0].payments.captures[0].amount.value === "13.99"
  ) {
    await fulfillOrder(captureData.payer.email_address);
  }
  res.json(captureData);
});

async function fulfillOrder(email) {
  // TODO: cache this so we don't read it each time
  const ebook = await readFile(__dirname + "/ebook.pdf", {
    encoding: "base64",
  });
  await sendgrid.send({
    // and we'll pass in an object which is going to have a bunch of prperties
    // first to, which takes our passed in email
    to: email,
    // from which will be your send grid approved email address
    from: "developer@paypal.com",
    subject: "PayPal Developer E-Book",
    text: "Attached is your e-book. Please enjoy!",
    // and then the attachment, so that's a property called attachments
    // which takes an array
    attachments: [
      {
        content: ebook, // the first thing that object needs is something called content
        // which is the
        filename: "ebook.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  });
}

app.listen(8888);
