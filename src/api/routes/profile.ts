import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/profiles", async (req, res) => {
  const profiles = await prisma.profile.findMany();
  res.json(profiles);
});

router.post("/profile/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const profileAlreadyExists = await prisma.profile.findUnique({
      where: { id: id },
    });
    if (!profileAlreadyExists) {
      res.status(200).send("Profile não Cadastrado");
    } else {
      const profile = await prisma.profile.update({
        data: {
          deleted_at: new Date(),
        },
        where: { id: id },
      });
      res.status(200).json(profile);
    }
  } catch (error) {
    res.status(500).end();
    return error;
  }
});

module.exports = router;
