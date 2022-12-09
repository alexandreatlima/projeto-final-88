import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";
import { OrderModel } from "../model/order.model.js";
import { ProductModel } from "../model/product.model.js";
import { UserModel } from "../model/user.model.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.body.product,
    });

    if (product.stockQuantity === 0) {
      return res.status(400).json({ msg: "Produto fora de estoque" });
    }

    const loggedInUser = req.currentUser;

    const order = await OrderModel.create({
      ...req.body,
      consumer: loggedInUser._id,
    });

    await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { $push: { orders: order._id } },
      { runValidators: true }
    );

    await ProductModel.findOneAndUpdate(
      { _id: product._id },
      {
        stockQuantity: product.stockQuantity - 1,
        $push: { orders: order._id },
      }
    );

    return res.status(201).json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

orderRouter.patch(
  "/cancel-order/:orderId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const { updateStock } = req.body;
      // boolean

      const updatedOrder = await OrderModel.findOneAndUpdate(
        { _id: req.params.orderId },
        { status: "Cancelado" },
        { new: true, runValidators: true }
      );

      if (updateStock) {
        const product = await ProductModel.findOne({
          _id: updatedOrder.product,
        });

        await ProductModel.findOneAndUpdate(
          { _id: product._id },
          { stockQuantity: product.stockQuantity + 1 }
        );
      }

      return res.status(200).json(updatedOrder);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

orderRouter.patch(
  "/update-status/:orderId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const updatedOrder = await OrderModel.findOneAndUpdate(
        { _id: req.params.orderId },
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedOrder);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

orderRouter.get("/", isAuth, attachCurrentUser, isAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.find({});

    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

orderRouter.get("/myOrders", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    const orders = await OrderModel.find({ consumer: loggedInUser._id });
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

orderRouter.get(
  "/admin/:orderId",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const order = await OrderModel.findOne({ _id: req.params.orderId });

      return res.status(200).json(order);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

orderRouter.get(
  "/myOrders/:orderId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const order = await OrderModel.findOne({ _id: req.params.orderId });

      if (loggedInUser._id !== order.consumer) {
        return res
          .status(401)
          .json({ msg: "Usuário não autorizado a acessar esse conteúdo." });
      }

      return res.status(200).json(order);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { orderRouter };
