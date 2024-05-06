// Import required modules
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:5500/index.html",
  "https://saleselixirreserves.com",
  "https://www.saleselixirreserves.com/",
  "https://www.saleselixirreserves.com",
  "https://76.76.21.9:443",
  "https://76.76.21.9:443/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(logRequest);
app.use(express.json());

app.post("/api/v1/google/spreedsheet/create", async (req, res) => {
  const google_key =
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8/dAOx1KnvvsR\nhWOa47Yyr8ZXZriff8AHd8Rj9bEDR7zQegaX+S1mp6ADZxcYFDjFq4tSJqLzPGYJ\nn6j34pUTDBipVIpTmzMTMeJEk7pAOBNi/L1byznSwng2s3oW60RzF5H5qmB6yJhq\n5N0Pgu6YQiK+l2c8+QYXmjKnDUv2ttLSh3+4AGnkCHhEkoZmXLXLdphdLKTD5vMw\nCo/PDlR9wq+sr3qVh4yOWVxbcEXmnWUNTdg1/PNvY6Bc+3kt5OfAMnp6jAYh+5zg\ngxdWELF1hQXLJYazEyM4D73BRo0pc2FV6lSY3EoweoXNOP0+EiqBSgKDTEddWoEh\nWlIy5k/pAgMBAAECggEAS+rRJv6ej0/CXxlsF44dZGMDk5xp0Xhp1RYhR94sCxtI\nF57NA0NPH4t6VaOVvVByNcVhI9DtaDP88SS3pUvZgls7lNmm70rKy40gTVfiW2Wr\nM/o+vp72TVldHOwfwREk3+657saoFup5f4cL3e1EltkKR/FdwTpvXg/NBRnsR+Ac\nJNMXCAbt+F750iWiDwivQlbEGdjDadWIMbu/3U/qkr3PGj4lLlxqE+oft36JPgXf\nhVj3dn2AH/CH+4GRcGnPAlmdeNt7jW29GrCzx4Mxc4ykhA3ph9uIoL3oYz/UNB7f\nFpDqXfmH32HOtAAzJa6EcKV7wfQ+k11OWiATgnbeOQKBgQDjOKwzo3+jwSsinAK5\nijxOpxl/JkRuTMdTzkia3vsFl9t5RSvrLaNkobSHae8LywJJ0esjiWw4eIFNQSxv\n0GYVNUcutfv+pkcVhJB3UJHJbMPwHmMHzcXMTAqkpIK0QTX8AOah4mfZ4URfV3Or\n6gusNVeFfDLWx1GcJ0/FUsGKrwKBgQDU7Zb067NXCLJ84AO6/+yH8Q7zSLalVcyT\n0TKlIWYZ8/Xvv2OrmeWrLcZYV0Gzf+kAen22Nz4vY2ZrV05RSSjdqmZtBSRC6KmN\n/Kb3TdWjGgYHX5qDgdoQV0DkH58xOR2Q/9SGyhlJCLvCogvOosGHJ2KG6btwtOGS\nik5BAHuU5wKBgEaycGnUujcSOECZeAOQrjjupvE3z9zdyLsbmN2O+V2BJUlzKzoO\nRiNeaNQlMrphnMGpLdctv91GKT0HRTM5DToWDKLM/q35wG5Cg8yL5gBc9g309m0M\nKjnpgvo9MWmyTICvKxM9ZYCWJXbgt93KgX1AT4352buX4p2KYbiMiimDAoGAP2QI\neBwfxT6CnOi4U5jTm1kp4UX5kllr0WoLkNvToNBfnKO3EaR8mqzDCxPXLJBdFtZg\nzLm/mq4WFMjmOQ71yqBrY/OO6xiHOg1IzAFxI+CggNt2jcY/3HONjxzW8PmXEs8H\nP6W1R2gBNh22NCuCQDF6hL3bHt/K9CyWxYVWRWsCgYBlqOMhYidj0BKpTF7r5Rip\ngbRrOQm/H7n6bZi4o26FB5Az1gK9FCFLYxBrjsPPV2/EEc+fLS0qz/9WypEodpMk\nPHCRkpFVoox83kofxw0nkn/d0xVvKzf9YIOZpsuvOXviKHv7yx8ZR8WkUkzv63mk\nYuUfHoEAil/x7ielnvxyRg==\n-----END PRIVATE KEY-----\n";
  try {
    const { name, email, phoneNumber } = req.body;

    const client = new google.auth.JWT(
      "excel-529@helpful-cat-420418.iam.gserviceaccount.com",
      null,
      google_key.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    await client.authorize();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = `1zj9i1DJPPAgnn9kvX2eaDjqLgEwSKEKQ7-bqAv2JbAc`;

    const range = "saleselixirreserves!B1:D1";

    const values = [["", name, email, phoneNumber]];

    const data = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    res.status(200).json({ message: "lead generate sussecfully" });
  } catch (error) {
    console.log(error);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
