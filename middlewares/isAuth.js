import { expressjwt } from "express-jwt";

import * as dotenv from "dotenv";

dotenv.config();

export default expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET,
  algorithms: ["HS256"],
});

// validar o token
// vai acrescentar informações no req
