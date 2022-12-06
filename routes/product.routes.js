import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";

import { ProductModel } from "../model/product.model.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const product = await ProductModel.create({
        ...req.body,
        creator: loggedInUser._id,
      });

      return res.status(201).json(product);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { productRouter };
