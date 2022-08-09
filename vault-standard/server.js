import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(express.static("public"));

// render checkout page with client id & unique client token
app.get("/checkout", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const customerId = "1234"; // hard-code for now to simplify
  const clientToken = await paypal.generateClientToken({
    customer_id: customerId,
  });
  res.render("checkout", { clientId, clientToken });
});

// create order
app.post("/api/orders", async (req, res) => {
  const customerId = "1234"; // hard-code for now to simplify
  const { paymentSource } = req.body;
  const order = await paypal.createOrder({ customerId, paymentSource});
  console.log(order)
  res.json(order);
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await paypal.capturePayment(orderID);
  res.json(captureData);
});

app.listen(8888, (e) => {
  console.log("Server listening at http://localhost:8888");
});
