import { Elysia } from "elysia";
import { userRoutes } from "./modules/users/routes";
import { errorMiddleware } from "./middlewares/error";

export const routes = new Elysia()
  .use(errorMiddleware)
  .use(userRoutes);