import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { dbConnection } from "./config/db.config.js";
import { productRouter } from "./routes/product.routes.js";
import { userRouter } from "./routes/user.routes.js";

dotenv.config();
const app = express();
dbConnection();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/product", productRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up at port ${process.env.PORT}`);
});
