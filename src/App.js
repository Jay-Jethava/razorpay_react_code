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

    // todo : change the endpoint with your api of the create payment order
    const endpoint = `http://localhost:3001/api/v1/bookings/book/event`;

    // todo : change the payload based on your api
    const payload = {
      EventId: 121,
      entries: 2,
      createTicketForSelf: true,
    };

    // todo : change the bearerToken to a valid jwt token of your project
    const bearerToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6Ik1lZXQgIiwidXNlck5hbWUiOiJtZWV0Li4xOTk5IiwiZW1haWwiOm51bGwsIm1vYmlsZSI6OTU4NjMxMTE5NywiZG9iIjpudWxsLCJteVJlZmVycmFsQ29kZSI6IjIxMDc3OCIsInJlZmVycmVkQ29kZSI6bnVsbCwicHJvZmlsZVBpYyI6Imh0dHBzOi8vYmFzaC1idWNrLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS8xNzAzNjcyNDM1MTU0LmpwZyIsInByaXZhdGVBY2MiOnRydWUsImJpbyI6bnVsbCwiZ2VuZGVyIjoiTWFsZSIsImZjbSI6ImVjbVhSVVY5VFRtUldJUG5IRXhCZEU6QVBBOTFiSFhEd2dlbXNqcVEyYU55WVB6UUx2akdrZ3hiZ1VvaGtBZWpNcWtUNURVVVh2U05tSDlKVnhpYjNFU1ItWlFFdXA5V3VsSWV2djRIY1ZkMVFMYmVEb1d2eGNlemxPejA3MHoxSjM4aU9RYy0xaW5uYnB0Qm95YTdJWFczM0ttbFN1bUxiOGsiLCJpc1Zpc2l0TGVkZ2Vyc09uIjp0cnVlLCJpc0Jsb2NrZWQiOmZhbHNlLCJsYXN0TG9naW5UaW1lIjoiMjAyNC0wMS0xOFQwODo0NzoyMy4wMDBaIiwicmVmZXJyZWRDb3VudCI6MCwiZGVsZXRlZEF0IjoiMTk3MC0wMS0wMVQwMDowMDowMC4wMDBaIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNFQxMzowNDo0Ny4wMDBaIiwidXBkYXRlZEF0IjoiMjAyNC0wMS0xOFQwNjoyNjoxNi4wMDBaIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3MDU1Njc2NDN9.102SJFIbxgYuLiRX3psEEjTVd7RNvCJb3wuMzW6Q3vs";

    const data = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + bearerToken,
      },
      body: JSON.stringify(payload),
    }).then((t) => t.json());

    console.log("Payment order created --->", data);

    // todo : fetch the order and RAZORPAY_KEY_ID based on the response of your api
    const order = data.data.paymentOrder;
    const RAZORPAY_KEY_ID = data.data.RAZORPAY_KEY_ID;

    const options = {
      // key: __DEV__ ? 'rzp_test_uGoq5ABJztRAhk' : 'PRODUCTION_KEY',
      key: RAZORPAY_KEY_ID,
      currency: order.currency,
      amount: order.amount.toString(),
      order_id: order.id,
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
