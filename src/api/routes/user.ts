import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/user", async (req, res) => {
  const { email, first_name, last_name, age, gender } = req.body;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userAlreadyExists) {
      res.status(200).send("Usuário já Cadastrado");
    } else {
      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
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
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).end();
    return error;
  }
});

router.patch("/user/:id", async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const { email, first_name, last_name, age, gender } = req.body;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!userAlreadyExists) {
      res.status(200).send("Usuário não Cadastrado");
    } else {
      const user = await prisma.user.update({
        data: {
          first_name,
          last_name,
          email,
          profiles: {
            update: {
              data: {
                age,
                gender,
              },
              where: {
                userId: id,
              },
            },
          },
        },
        where: { email: email },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          profiles: true,
        },
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
