import { Elysia } from "elysia";
import { findUserById, getAllUsers } from "./service";
import { jwtMiddleware } from "../../middlewares/jwt";
import { rateLimitMiddleware } from "../../middlewares/rateLimit";
import {
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
} from "../../middlewares/error";

export const userRoutes = new Elysia({ prefix: "/users" })
	.use(rateLimitMiddleware)
	.use(jwtMiddleware)
	.get("/", async ({ jwt, headers, rateLimit, limited }) => {
		if (limited) {
			throw new BadRequestError("Rate limit exceeded");
		}

		const authHeader = headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError();
		}

		const token = authHeader.substring(7);
		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			throw new UnauthorizedError();
		}

		// Role-based access control
		if ((decodedUser as any).role !== "superadmin") {
			throw new ForbiddenError("Insufficient permissions");
		}

		const users = await getAllUsers();
		return users.map(({ password, ...rest }) => rest);
	})
	.get("/profile", async ({ jwt, headers }) => {
		const authHeader = headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError();
		}

		const token = authHeader.substring(7);
		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			throw new UnauthorizedError();
		}

		const userProfile = await findUserById((decodedUser as any).id);
		if (!userProfile) {
			throw new NotFoundError("User not found");
		}
		const { password, ...rest } = userProfile;
		return rest;
	});
