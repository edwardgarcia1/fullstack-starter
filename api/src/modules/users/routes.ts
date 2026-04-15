import { Elysia, t } from "elysia";
import {
	createUser,
	findUserByUsername,
	findUserById,
	validatePassword,
	getAllUsers,
} from "./service";
import { jwtMiddleware, refreshTokenMiddleware } from "../../middlewares/jwt";
import { rateLimitMiddleware } from "../../middlewares/rateLimit";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "../../middlewares/error";

export const userRoutes = new Elysia()
	.use(rateLimitMiddleware)
	.use(jwtMiddleware)
	.use(refreshTokenMiddleware)
	.post(
		"/api/register",
		async ({ body, rateLimit, limited }) => {
			if (limited) {
				throw new BadRequestError("Rate limit exceeded");
			}

			const bodyTyped = body as {
				username: string;
				password: string;
				name: string;
			};

			const existingUser = await findUserByUsername(bodyTyped.username);
			if (existingUser) {
				throw new BadRequestError("Username already exists");
			}
			const user = await createUser(bodyTyped);
			return { message: "User registered successfully", userId: user.id };
		},
		{
			body: t.Object({
				username: t.String(),
				password: t.String(),
				name: t.String(),
			}),
		},
	)
	.post(
		"/api/login",
		async ({ body, rateLimit, limited, jwt, refreshJwt }) => {
			if (limited) {
				throw new BadRequestError("Rate limit exceeded");
			}

			const bodyTyped = body as { username: string; password: string };

			const user = await findUserByUsername(bodyTyped.username);
			if (!user) {
				throw new UnauthorizedError("Invalid credentials");
			}
			const isValid = await validatePassword(
				bodyTyped.password,
				user.password,
			);
			if (!isValid) {
				throw new UnauthorizedError("Invalid credentials");
			}
			const accessToken = await jwt.sign({
				id: user.id,
				username: user.username,
				role: user.role,
			});
			const refreshToken = await refreshJwt.sign({
				userId: user.id,
				tokenId: Math.random().toString(36).substring(7),
			});
			return {
				accessToken,
				refreshToken,
				user: {
					id: user.id,
					username: user.username,
					name: user.name,
					role: user.role,
				},
			};
		},
		{
			body: t.Object({
				username: t.String(),
				password: t.String(),
			}),
		},
	)
	.post("/api/logout", async ({ jwt, headers }) => {
		const authHeader = headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError();
		}

		const token = authHeader.substring(7);
		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			throw new UnauthorizedError();
		}

		// In a real application, you would add the token to a blacklist
		return { message: "Logged out successfully" };
	})
	.get("/api/users", async ({ jwt, headers, rateLimit, limited }) => {
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
	.get("/api/profile", async ({ jwt, headers }) => {
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
	})
	.post(
		"/api/refresh",
		async ({ body, refreshJwt, jwt }) => {
			const bodyTyped = body as { refreshToken: string };

			if (!bodyTyped.refreshToken) {
				throw new UnauthorizedError("Refresh token required");
			}

			const decodedRefresh = await refreshJwt.verify(bodyTyped.refreshToken);
			if (!decodedRefresh) {
				throw new UnauthorizedError("Invalid refresh token");
			}

			const userId = (decodedRefresh as any).userId;
			const user = await findUserById(userId);
			if (!user) {
				throw new UnauthorizedError("User not found");
			}

			const newAccessToken = await jwt.sign({
				id: user.id,
				username: user.username,
				role: user.role,
			});

			const newRefreshToken = await refreshJwt.sign({
				userId: user.id,
				tokenId: Math.random().toString(36).substring(7),
			});

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
				user: {
					id: user.id,
					username: user.username,
					name: user.name,
					role: user.role,
				},
			};
		},
		{
			body: t.Object({
				refreshToken: t.String(),
			}),
		},
	)
	.post(
		"/api/access",
		async ({ body, jwt }) => {
			const bodyTyped = body as { token: string };

			if (!bodyTyped.token) {
				throw new UnauthorizedError("Token required");
			}

			const decoded = await jwt.verify(bodyTyped.token);
			if (!decoded) {
				throw new UnauthorizedError("Invalid token");
			}

			const userId = (decoded as any).id;
			const user = await findUserById(userId);
			if (!user) {
				throw new UnauthorizedError("User not found");
			}

			const { password, ...userWithoutPassword } = user;
			return {
				accessToken: bodyTyped.token,
				user: userWithoutPassword,
			};
		},
		{
			body: t.Object({
				token: t.String(),
			}),
		},
	);
