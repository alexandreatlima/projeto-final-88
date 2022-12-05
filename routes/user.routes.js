import bcrypt from "bcrypt";
import express from "express";
import { generateToken } from "../config/jwt.config.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAuth from "../middlewares/isAuth.js";
import { UserModel } from "../model/user.model.js";

import * as dotenv from "dotenv";
dotenv.config();

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({ msg: "Senha não atende os requisitos" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));

    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`SALT = ${salt}`);
    console.log(`SENHA HASHEADA = ${hashedPassword}`);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos" });
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(404).json({ msg: "Email ou senha invalidos" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
  }
});

userRouter.get("/profile", isAuth, attachCurrentUser, (req, res) => {
  const loggedInUser = req.currentUser;

  return res.status(200).json(loggedInUser);
});

export { userRouter };
