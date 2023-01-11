import express from "express";
import axios from "axios";
import { URL_EURO_PRICE } from "../utils/constants";

const router = express.Router();

router.get("/currency-euro", async (req, res) => {
  try {
    const euroPrice = await axios.get(URL_EURO_PRICE);
    return res.status(200).json(euroPrice.data);
  } catch (error) {
    return res.status(500).json({
      message: "Não foi possível consultar o valor atual do euro",
      ...error,
    });
  }
});

module.exports = router;
