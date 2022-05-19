/**
 * A simple wrapper around calls to our app server which
 * will call the PayPal Orders API
 */

export function createOrder() {
  return fetch("/api/orders", {
    method: "post",
    // use the "body" param to optionally pass additional order information like
    // product ids or amount.
  }).then((res) => res.json());
}

export function captureOrder(orderId) {
  return fetch(`/api/orders/${orderId}/capture`, {
    method: "post",
  }).then((res) => res.json());
}
