paypal
  .Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
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
      })

      // When creating an order on the server:
      //
      // return fetch("/api/orders", {
      //   method: "post",
      // })
      //   .then((response) => response.json())
      //   .then((response) => {
      //     console.log(response);
      //     return response.id;
      //   });

    },


    onShippingChange: function (data, actions) {
      const baseAmount = "15.00";
      const valueWithShipping = parseFloat(baseAmount) + parseFloat(data.selected_shipping_option.amount.value);
      const value = { value: valueWithShipping, currency_code: data.amount.currency_code };

      // returns a promise to tell the popup when the update is complete
      return actions.order.patch([
        {
          op: "replace",
          path: "/purchase_units/@reference_id=='default'/amount",
          value,
        },
      ]);

      // When updating the order on the server:
      //
      // return fetch(`/api/orders/${data.orderID}`, {
      //   method: "post",
      //   headers: {
      //     "Content-type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     shippingOption: data.selected_shipping_option
      //   })
      // })

    },

    // Finalize the transaction after payer approval
    onApprove: function (data, actions) {
      return fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((response) => response.json())
        .then(function (orderData) {
          // Successful capture! For dev/demo purposes:
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2)
          );
          var transaction = orderData.purchase_units[0].payments.captures[0];
          alert(
            "Transaction " +
              transaction.status +
              ": " +
              transaction.id +
              "\n\nSee console for all available details"
          );

          // When ready to go live, remove the alert and show a success message within this page. For example:
          // var element = document.getElementById('paypal-button-container');
          // element.innerHTML = '';
          // element.innerHTML = '<h3>Thank you for your payment!</h3>';
          // Or go to another URL:  actions.redirect('thank_you.html');
        });
    },
  })
  .render("#paypal-button-container");
