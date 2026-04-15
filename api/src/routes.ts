import { Elysia } from "elysia";
import { userRoutes } from "./modules/users/routes";

export const routes = new Elysia()
  .use(userRoutes);