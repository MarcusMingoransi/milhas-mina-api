import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import {
  comparePassword,
  encryptPassword,
} from "../helpers/password-encryption";
import { EXPIRE_TOKEN } from "../utils/constants";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, age, gender } = req.body;
  if (!email || !password)
    return res.status(403).send({ message: "Dados Inválidos!" });
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userAlreadyExists) {
      return res.status(403).send({ message: "Usuário já Cadastrado" });
    } else {
      const hashedPassword = await encryptPassword(String(password));
      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          profiles: {
            create: {
              age,
              gender,
            },
          },
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          profiles: true,
        },
      });
      return res
        .status(200)
        .json({ message: "Usuário criado com sucesso!", ...user });
    }
  } catch (error) {
    return res.status(500).end();
  }
});

router.patch("/reset-password/:id", async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { id },
    });
    if (!userAlreadyExists) {
      return res.status(200).send({ message: "Usuário não Cadastrado" });
    } else {
      const hashedPassword = await encryptPassword(password);
      const user = await prisma.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id,
        },
      });
      return res.status(200).json({ message: "Senha alterada com sucesso" });
    }
  } catch (error) {
    return res.status(500).end();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userAlreadyExists = await prisma.user.findFirst({
    where: { email: email },
    select: {
      id: true,
      password: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  if (userAlreadyExists) {
    const isPasswordValid = await comparePassword(
      String(password),
      String(userAlreadyExists.password)
    );

    if (isPasswordValid) {
      var token = jwt.sign(
        { id: userAlreadyExists.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: EXPIRE_TOKEN,
        }
      );
      const { password, ...rest } = userAlreadyExists;
      return res
        .status(200)
        .json({ ...rest, token: token, expires_in: EXPIRE_TOKEN });
    }
    return res.status(500).json({ message: "Senha Inválida" });
  }

  return res.status(500).json({ message: "Usuário ou senha inválidos" });
});

router.get("/logout", function (req, res) {
  res.status(200).json({ auth: false, token: null });
});

module.exports = router;
