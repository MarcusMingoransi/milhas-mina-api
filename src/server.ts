import express from "express";
import dotenv from "dotenv";
dotenv.config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { verifyJWT } = require("./api/middlewares/auth");

const app = express();

const authRouter = require("./api/routes/auth");
const userRouter = require("./api/routes/user");
const profileRouter = require("./api/routes/profile");
const currencyRouter = require("./api/routes/currency");

app.use(cors());
app.use(express.json());
app.use("/", authRouter);
app.use("/", verifyJWT, userRouter);
app.use("/", verifyJWT, profileRouter);
app.use("/", verifyJWT, currencyRouter);

app.listen(8080, () =>
  console.log("REST API server ready at: http://localhost:8080")
);
