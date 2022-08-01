import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./App.css";

function App() {
  return (
    <div className="App-body">
      <h1>PayPal Developer E-Book</h1>
      <img
        height="300"
        src="/ebook.jpg"
        alt="How to be Great at Anything (Book Cover)"
      />
      <p>
        <span className="book-price">$13.99</span>
      </p>
      <PayPalScriptProvider
        options={{ "client-id": import.meta.env.VITE_CLIENT_ID }}
      >
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "13.99",
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            const name = details.payer.name.given_name;
            alert("Transaction completed by " + name);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

export default App;
