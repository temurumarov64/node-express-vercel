require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

let count = 0;

const users = [
  {
    id: 0,
    email: "temur@gmail.com",
    password: "123456",
    name: "Temur",
  },
];

app.get("/count", authenticateToken, (req, res) => {
  count = 0;
  res.json(count);
});

app.put("/increment", authenticateToken, (req, res) => {
  count = count == 0 ? 1 : count * 2;
  res.json(count);
});

app.post("/login", (req, res) => {
  //Authenticate the user;
  const { email, password } = req.body;
  const foundUsers = users.filter(
    (user) => user.email === email && user.password === password
  );

  if (foundUsers.length === 0) {
    res.status(401).json("Login or password are incorrect");
  }

  const user = foundUsers[0];

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.json({ email: user.email, name: user.name, accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

app.listen(3000);
