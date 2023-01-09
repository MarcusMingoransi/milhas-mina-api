import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
const { EXPIRE_TOKEN } = require("../utils/constants");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userAlreadyExists = await prisma.user.findFirst({
    where: { email: email, password: password },
  });
  if (userAlreadyExists) {
    var token = jwt.sign(
      { id: userAlreadyExists.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: EXPIRE_TOKEN, // expires in 5min
      }
    );
    return res.status(200).json({ auth: true, token: token });
  }

  return res.status(500).json("Login inválido!");
});

router.get("/logout", function (req, res) {
  res.status(200).json({ auth: false, token: null });
});

module.exports = router;
