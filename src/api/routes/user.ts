import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/user", async (req, res) => {
  const { email, name, age, gender } = req.body;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userAlreadyExists) {
      res.status(200).send("Usuário já Cadastrado");
    } else {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          profiles: {
            create: {
              age,
              gender,
            },
          },
        },
      });
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).end();
    return error;
  }
});

router.patch("/user", async (req, res) => {
  const { email, name, age, gender } = req.body;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!userAlreadyExists) {
      res.status(200).send("Usuário não Cadastrado");
    } else {
      const user = await prisma.user.update({
        data: {
          name,
          email,
          profiles: {
            update: {
              data: {
                age,
              },
              where: {
                userId: userAlreadyExists.id,
              },
            },
          },
        },
        where: { email: email },
      });
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).end();
    return error;
  }
});

router.post("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!userAlreadyExists) {
      res.status(200).send("Usuário não Cadastrado");
    } else {
      const user = await prisma.user.update({
        data: {
          deleted_at: new Date(),
        },
        where: { id: id },
      });
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).end();
    return error;
  }
});

module.exports = router;
