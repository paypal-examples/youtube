# Order Fulfillment Example

This folder contains example code for a standard PayPal integration using both the JS SDK and node.js that demonstrates how to fulfill successful orders for an e-book using SendGrid and the PayPal REST API.

## Instructions

1. [Signup for a free Sendgrid Account](https://signup.sendgrid.com/), create a sender identity, and in Settings, create an API Key
1. Replace `test` in `public/index.html` with your app's client-id
1. Create a file called `.env` and add the following:

```
CLIENT_ID=<YOUR_CLIENT_ID>
APP_SECRET=<YOUR_APP_SECRET>
SENDGRID_API_KEY=<YOUR_API_KEY>
```

1. Run `npm install`
1. Run `npm start`
1. Open http://localhost:8888

## Resources

https://www.twilio.com/blog/sending-email-attachments-with-sendgrid is a fairly comprehensive tutorial which covers a similar topic.
