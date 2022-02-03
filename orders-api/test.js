import * as paypal from "./paypal.js";

main();

async function main() {
  let order = await paypal.createOrder();
  paypal.capturePayment(order.id);
}
