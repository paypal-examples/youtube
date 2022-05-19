/**
 * This file adds PayPal Buttons to your checkout page
 */

import * as api from "./api.js";

paypal
  .Buttons({
    style: {
      layout: "horizontal",
      tagline: false,
    },
    // Sets up the transaction when a payment button is clicked
    createOrder(data, actions) {
      return api.createOrder();
    },
    // Finalize the transaction after payer approval
    async onApprove(data, actions) {
      const orderData = await api.captureOrder(data.orderID);
      // Successful capture! For dev/demo purposes:
      console.log(
        "Capture result",
        orderData,
        JSON.stringify(orderData, null, 2)
      );
      var transaction = orderData.purchase_units[0].payments.captures[0];
      alert(`Transaction ${transaction.status}: ${transaction.id}

        See console for all available details
      `);
      // When ready to go live, remove the alert and show a success message within this page. For example:
      // var element = document.getElementById('paypal-button-container');
      // element.innerHTML = '<h3>Thank you for your payment!</h3>';
      // Or go to another URL:  actions.redirect('thank_you.html');
    },
  })
  .render("#paypal-button-container");
