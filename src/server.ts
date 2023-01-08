import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

const userRouter = require("./api/routes/user");
const profileRouter = require("./api/routes/profile");

app.use(express.json());
app.use("/", userRouter);
app.use("/", profileRouter);

app.listen(8080, () =>
  console.log("REST API server ready at: http://localhost:8080")
);
