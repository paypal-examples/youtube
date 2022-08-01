# Shipping Options & Update Order Example

This folder contains example code for customizing shipping options and responding to shipping option changes by updating the price associated with an order. It includes examples for both the PayPal JS SDK on the client and the PayPal REST API on the server side.

## Setup

Create a file called `.env` and add the following:

```
CLIENT_ID=<YOUR_CLIENT_ID>
APP_SECRET=<YOUR_APP_SECRET>
```

## Running

1. Run `npm install`
1. Run `npm start`
1. `open http://localhost:5555`

## Resources

- [Orders API: Update Order](https://developer.paypal.com/docs/api/orders/v2/#orders_patch)
- [Orders API: Shipping Options](https://developer.paypal.com/docs/api/orders/v2/#definition-shipping_option)
- [PayPal JS SDK: Shipping Changes](https://developer.paypal.com/sdk/js/reference/#onshippingchange)