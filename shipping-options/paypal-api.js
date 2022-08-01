import fetch from "node-fetch";
import "dotenv/config"; // loads env variables from .env file

const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";


// Create an order with shipping options
// using the REST API
export async function createOrder() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            value: "15.00",
            currency_code: "USD",
          },
          shipping: {
            options: [
              {
                id: "SHIP_123",
                label: "Standard Shipping",
                type: "SHIPPING",
                selected: true,
                amount: {
                  value: "3.00",
                  currency_code: "USD",
                },
              },
              {
                id: "SHIP_456",
                label: "Pick up in Store",
                type: "PICKUP",
                selected: false,
                amount: {
                  value: "0.00",
                  currency_code: "USD",
                },
              },
            ],
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function generateAccessToken() {
  const response = await fetch(base + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function viewOrder(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // TODO: needs some error handling
  // just return whatever the server provides
  return response.json();
}

export async function updateOrder(orderId, shippingOption) {
  // calculate the new price of the order
  const baseValue = "15.00";
  const valueWithShipping = parseFloat(baseValue) + parseFloat(shippingOption.amount.value);
  const value = { value: valueWithShipping.toFixed(2), currency_code: "USD" };

  // send the patch request to the orders api
  const url = `${base}/v2/checkout/orders/${orderId}`;
  const accessToken = await generateAccessToken();
  const response = await fetch(url, {
    method: "patch",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify([
      {
        op: "replace",
        path: "/purchase_units/@reference_id=='default'/amount",
        value,
      },
      // The patch call accepts an arrray, which can execute multiple
      // commands with a single request:
      //
      //   {
      //     op: "add",
      //     path: "/purchase_units/@reference_id=='default'/shipping/address",
      //     value: {
      //       address_line_1: "1235 Townsend St",
      //       address_line_2: "Floor 6",
      //       admin_area_2: "Sacramento",
      //       admin_area_1: "CA",
      //       postal_code: "11099",
      //       country_code: "US",
      //     },
      //   },
      //   {
      //     op: "add",
      //     path: "/purchase_units/@reference_id=='default'/invoice_id",
      //     value: "03012022-3303-01",
      //   },
    ]),
  });

  // when the patch is successful you should receive a 204
  if (response.status === 204) {
    return { success: true };
  }

  // most errors show up with a status code 422
  // it can be helpful to parse the errors and return them
  if (response.status === 422) {
    const data = await response.json();
    return {
      error: response.statusText,
      status: response.status,
      details: data.details,
    };
  }

  // Debugging: log out any other status codes and messages
  // console.log({
  //   url,
  //   status: response.status,
  //   statusText: response.statusText,
  // });

}
