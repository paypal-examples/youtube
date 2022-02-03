import express from "express";
import axios from "axios";
import fetch from "node-fetch";
import "dotenv/config"; // loads env variables from .env file

const { CLIENT_ID, APP_SECRET } = process.env;

const base = "https://api-m.sandbox.paypal.com";

const app = express();

// test route
app.get("/test", async (req, res) => {
  const data = await generateAccessTokenFetch();
  console.log(data);
  res.json(data);
});

// axios version
async function generateAccessToken() {
  const response = await axios({
    url: base + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: CLIENT_ID,
      password: APP_SECRET,
    },
  });
  return response.data;
}

// fetch version
async function generateAccessTokenFetch() {
  const response = await fetch(base + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data;
}

app.listen(3000);
