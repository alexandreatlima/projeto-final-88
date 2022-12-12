import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { dbConnection } from "./config/db.config.js";
import { orderRouter } from "./routes/order.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { uploadImageRouter } from "./routes/uploadImage.routes.js";
import { userRouter } from "./routes/user.routes.js";

dotenv.config();
const app = express();
dbConnection();

app.use(cors({ origin: process.env.REACT_APP_URL }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/upload-image", uploadImageRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up at port ${process.env.PORT}`);
});
