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

productRouter.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find({});

    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

productRouter.get("/:productId", async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.productId });

    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

productRouter.put(
  "/:productId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: req.params.productId },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

productRouter.delete(
  "/:productId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const deletedProduct = await ProductModel.deleteOne({
        _id: req.params.productId,
      });

      return res.status(200).json(deletedProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { productRouter };
