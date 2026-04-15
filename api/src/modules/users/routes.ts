import { Elysia, t } from "elysia";
import {
	createUser,
	findUserByUsername,
	findUserById,
	validatePassword,
	getAllUsers,
} from "./service";
import { jwtMiddleware } from "../../middlewares/jwt";
import { rateLimitMiddleware } from "../../middlewares/rateLimit";

export const userRoutes = new Elysia()
	.use(rateLimitMiddleware)
	.use(jwtMiddleware)
	.post(
		"/api/register",
		async ({ body, rateLimit, limited }) => {
			if (limited) {
				return { error: "Rate limit exceeded", retryAfter: rateLimit.reset };
			}

			const bodyTyped = body as {
				username: string;
				password: string;
				name: string;
			};

			try {
				const existingUser = await findUserByUsername(bodyTyped.username);
				if (existingUser) {
					return { error: "Username already exists" };
				}
				const user = await createUser(bodyTyped);
				return { message: "User registered successfully", userId: user.id };
			} catch (error) {
				console.error("Registration error:", error);
				return {
					error: error instanceof Error ? error.message : "Registration failed",
				};
			}
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
		async ({ body, rateLimit, limited, jwt }) => {
			if (limited) {
				return { error: "Rate limit exceeded", retryAfter: rateLimit.reset };
			}

			const bodyTyped = body as { username: string; password: string };

			try {
				const user = await findUserByUsername(bodyTyped.username);
				if (!user) {
					return { error: "Invalid credentials" };
				}
				const isValid = await validatePassword(
					bodyTyped.password,
					user.password,
				);
				if (!isValid) {
					return { error: "Invalid credentials" };
				}
				const token = await jwt.sign({
					id: user.id,
					username: user.username,
					role: user.role,
				});
				return {
					token,
					user: {
						id: user.id,
						username: user.username,
						name: user.name,
						role: user.role,
					},
				};
			} catch (error) {
				console.error("Login error:", error);
				return { error: "Login failed" };
			}
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
			return { error: "Unauthorized" };
		}

		const token = authHeader.substring(7);
		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			return { error: "Unauthorized" };
		}

		// In a real application, you would add the token to a blacklist
		return { message: "Logged out successfully" };
	})
	.get("/api/users", async ({ jwt, headers, rateLimit, limited }) => {
		if (limited) {
			return { error: "Rate limit exceeded", retryAfter: rateLimit.reset };
		}

		const authHeader = headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return { error: "Unauthorized" };
		}

		const token = authHeader.substring(7);
		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			return { error: "Unauthorized" };
		}

		// Role-based access control
		if ((decodedUser as any).role !== "superadmin") {
			return { error: "Insufficient permissions" };
		}

		try {
			const users = await getAllUsers();
			return users.map(({ password, ...rest }) => rest);
		} catch (error) {
			console.error("Get users error:", error);
			return { error: "Failed to fetch users" };
		}
	})
	.get("/api/profile", async ({ jwt, headers }) => {
		const authHeader = headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return { error: "Unauthorized" };
		}

		const token = authHeader.substring(7);
		const decodedUser = await jwt.verify(token);

		if (!decodedUser) {
			return { error: "Unauthorized" };
		}

		try {
			const userProfile = await findUserById((decodedUser as any).id);
			if (!userProfile) {
				return { error: "User not found" };
			}
			const { password, ...rest } = userProfile;
			return rest;
		} catch (error) {
			console.error("Get profile error:", error);
			return { error: "Failed to fetch profile" };
		}
	});
