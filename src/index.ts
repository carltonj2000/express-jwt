const express = require("express");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "my_secret_key";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api", (req, res) => res.json({ text: "my api 2" }));

app.get("/api/login", (req, res) => {
  const user = { id: 3 };
  const token = jwt.sign({ user }, SECRET_KEY);
  res.json({ token });
});

app.get("/api/protected", ensureToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, data) => {
    if (err) return res.sendStatus(403);
    res.json({ text: "this is protected", data });
  });
});

function ensureToken(req, res, next) {
  console.log(req.headers);
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
