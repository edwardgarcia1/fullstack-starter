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
	.get("/", async ({ jwt, headers, cookie, rateLimit, limited }) => {
		if (limited) {
			throw new BadRequestError("Rate limit exceeded");
		}

		const authHeader = headers.authorization;
		let token: string | null = null;

		if (
			authHeader &&
			typeof authHeader === "string" &&
			authHeader.startsWith("Bearer ")
		) {
			token = authHeader.substring(7);
		} else if (
			(cookie as any)?.accessToken.value &&
			typeof (cookie as any).accessToken.value === "string"
		) {
			token = (cookie as any).accessToken.value;
		}

		if (!token) {
			throw new UnauthorizedError("No authentication token provided");
		}

		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			throw new UnauthorizedError("Invalid token");
		}

		// Role-based access control
		if ((decodedUser as any).role !== "superadmin") {
			throw new ForbiddenError("Insufficient permissions");
		}

		const users = await getAllUsers();
		return users.map(({ password, ...rest }) => rest);
	})
	.get("/profile", async ({ jwt, headers, cookie }) => {
		const authHeader = headers.authorization;
		let token: string | null = null;

		if (
			authHeader &&
			typeof authHeader === "string" &&
			authHeader.startsWith("Bearer ")
		) {
			token = authHeader.substring(7);
		} else if (
			(cookie as any)?.accessToken.value &&
			typeof (cookie as any).accessToken.value === "string"
		) {
			token = (cookie as any).accessToken.value;
		}

		if (!token) {
			throw new UnauthorizedError("No authentication token provided");
		}

		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			throw new UnauthorizedError("Invalid token");
		}

		const userProfile = await findUserById((decodedUser as any).id);
		if (!userProfile) {
			throw new NotFoundError("User not found");
		}
		const { password, ...rest } = userProfile;
		return rest;
	});
