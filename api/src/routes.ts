import { Elysia } from "elysia";
import { authRoutes } from "./modules/users/auth.routes";
import { userRoutes } from "./modules/users/users.routes";
import { errorMiddleware } from "./middlewares/error";

export const routes = new Elysia({ prefix: "/api" })
	.use(errorMiddleware)
	.use(authRoutes)
	.use(userRoutes);
