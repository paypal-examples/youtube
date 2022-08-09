/**
 * A simple wrapper around calls to our app server which
 * will call the PayPal Orders API
 */
 export function createOrder(body) {
  const request = {
    method: "post",
    headers: { "Content-Type": "application/json" }
    // use the "body" param to optionally pass additional order information like
    // product ids or amount.
  };
  if (body) request.body = JSON.stringify(body);
  return fetch("/api/orders", request).then((res) => res.json());
}

export function captureOrder(orderId) {
  return fetch(`/api/orders/${orderId}/capture`, {
    method: "post",
  }).then((res) => res.json());
}
