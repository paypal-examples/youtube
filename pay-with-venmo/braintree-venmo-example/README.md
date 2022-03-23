# Braintree - Pay with Venmo Integration Example

## Overview 

This Braintree Drop-in UI integration automatically renders the Venmo button for eligible devices.

## Main Technologies

* JavaScript
* Nodejs/Express
* Braintree Drop-in UI


## Getting Up and Running

1. Install packages:

   ```sh
   npm install
   ```

2. Create a new file name `.env` and fill in your Braintree API credentials. These credentials can be found by navigating to API > API Keys in the gear icon in the top right corner of your Braintree Control Panel. Information about locating API Keys can be [found in our developer documentation](https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials).

3. Start the server:

   ```sh
   npm start
   ```

   By default, this runs the app on port `3000`. You can configure the port by setting the environmental variable `PORT`.

