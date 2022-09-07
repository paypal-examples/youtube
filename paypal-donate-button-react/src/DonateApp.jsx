import { useEffect, useState, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// There are 3 ways to keep the amount from being stale in our createOrder callback:
// 1. Use amountRef.current to keep track of amount changes
// 2. Use the forceReRender prop (which causes flashing)
// 3. Use the key property (which also causes flashing)

const DonateButton = ({ currency, amount }) => {
  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  return (
    <PayPalButtons
      // forceReRender={[currency, amount]}
      style={{ color: "black", label: "donate" }}
      fundingSource="paypal"
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amountRef.current,
                breakdown: {
                  item_total: {
                    currency_code: currency,
                    value: amountRef.current
                  }
                }
              },
              items: [
                {
                  name: "Cat Fundraiser",
                  description:
                    "All proceeds directly support Furby's care and recovery.",
                  quantity: "1",
                  unit_amount: {
                    currency_code: currency,
                    value: amountRef.current
                  },
                  category: "DONATION"
                }
              ]
            }
          ]
        });
      }}
    />
  );
};

function DonateForm() {
  const [amount, setAmount] = useState("5.00");
  return (
    <form className="DonateForm">
      <AmountPicker
        onAmountChange={(e) => {
          setAmount(e.target.value);
        }}
      />
      <DonateButton currency="USD" amount={amount} />
    </form>
  );
}

function AmountPicker({ onAmountChange }) {
  return (
    <fieldset onChange={onAmountChange}>
      <legend>Donation Amount</legend>
      <label>
        <input type="radio" value="5.00" defaultChecked="true" name="amount" />
        5.00
      </label>
      <label>
        <input type="radio" value="10.00" name="amount" id="radio-6" />
        10.00
      </label>
      <label>
        <input type="radio" value="15.00" name="amount" id="radio-9" />
        15.00
      </label>
    </fieldset>
  );
}

export function DonateApp() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "test",
        components: "buttons",
        currency: "USD"
      }}
    >
      <h1>Donate to Kitty's Care</h1>
      <figure>
        <img src="https://placekitten.com/500/300" alt="Kitty Looking Cute" />
        <figcaption></figcaption>
      </figure>
      <DonateForm />
    </PayPalScriptProvider>
  );
}
