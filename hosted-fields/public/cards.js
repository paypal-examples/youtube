/**
 * Adds card processing to our checkout page
 */

import * as api from "./api.js";

// define references to key elements
const cardForm = document.getElementById("card-form");
const cardholderName = document.getElementById("card-holder-name");
const countryCode = document.getElementById("card-billing-address-country");
const postalCode = document.getElementById("card-billing-address-zip");

// the is the main function that gets run
export async function setupCardFields() {
  if (paypal.HostedFields.isEligible()) {
    // render hosted fields and get back the card fields object
    const cardFields = await renderCardFields();

    // setup our submit handler to handle the checkout
    cardForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await checkout(cardFields).catch((err) => {
        alert("Payment could not be captured! " + JSON.stringify(err));
      });
    });
  }
}

// renders the hosted fields inside our form
async function renderCardFields() {
  const cardFields = await paypal.HostedFields.render({
    fields: {
      number: {
        selector: "#card-number",
        placeholder: "4111 1111 1111 1111",
      },
      cvv: {
        selector: "#cvv",
        placeholder: "123",
      },
      expirationDate: {
        selector: "#expiration-date",
        placeholder: "MM/YY",
      },
    },
    // styles: {
    //   input: {
    //     color: "teal",
    //   },
    //   "::placeholder": {
    //     color: "pink",
    //   },
    //   ".valid": {
    //     color: "green",
    //   },
    //   ".invalid": {
    //     color: "red",
    //   },
    // },
    async createOrder() {
      const order = await api.createOrder();
      return order.id;
    },
  });
  return cardFields;
}

// complete checkout by submitting the card form and capturing payment
async function checkout(cardFields) {
  // submit completes the process of creating an order
  const { orderId } = await cardFields.submit({
    cardholderName: cardholderName.value,
    billingAddress: {
      postalCode: postalCode.value,
      countryCodeAlpha2: countryCode.value,
    },
  });

  // once the order has all the neccessary info we can call capture
  const orderData = await api.captureOrder(orderId);

  // recoverable errors
  const errorDetail = Array.isArray(orderData.details) && orderData.details[0];
  if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
    return alert("Please try a different funding source.");
    // See: https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
  }

  // unrecoverable errors
  if (errorDetail) {
    let msg = "Sorry, your transaction could not be processed.";
    if (errorDetail.description) {
      msg += "\n\n" + errorDetail.description;
    }
    if (orderData.debug_id) {
      msg += " (" + orderData.debug_id + ")";
    }
    return alert(msg); // Show a failure message
  }

  // show a success message or redirect
  window.location = "/?success";
}
