import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const __DEV__ = document.domain === "localhost";

function App() {
  const [name, setName] = useState("Mehul");

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // http://localhost:1337/razorpay

    const data = await fetch("http://localhost:1337/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
      body: JSON.stringify({ amount: 123 }),
    }).then((t) => t.json());

    console.log(data);

    const options = {
      // key: __DEV__ ? 'rzp_test_uGoq5ABJztRAhk' : 'PRODUCTION_KEY',
      key: "rzp_test_gJNpaDGvyUrYzN",
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Donation",
      description: "Thank you for nothing. Please give us some money",
      // image: "http://localhost:1337/logo.svg",
      notes: {
        address: "Razorpay Corporate Office",
      },
      handler: function (response) {
        console.log("res from handler\n", response);
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Jay Jethava",
        email: "jayjethva2018@gmail.com",
        phone_number: "9924170840",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          onClick={displayRazorpay}
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate $5
        </a>
      </header>
    </div>
  );
}

export default App;
