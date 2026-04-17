import { Elysia } from "elysia";
import { jwtMiddleware } from "./jwt";
import { findUserById } from "../modules/users/service";

export interface AuthUser {
	id: number;
	username: string;
	name: string;
	role: string;
}

declare module "elysia" {
	interface State {
		user: AuthUser | null;
	}
}

export const authGuard = (app: Elysia) =>
	app.use(jwtMiddleware).derive(async ({ jwt, cookie }) => {
		let token: string | null = null;

		const authHeader = (cookie as any)?.authorization;
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
			return { user: null };
		}

		try {
			const decoded = await jwt.verify(token);
			const userId = (decoded as any).id;
			const user = await findUserById(userId);

			if (!user) {
				return { user: null };
			}

			const { password, ...userWithoutPassword } = user;

			return {
				user: {
					id: userWithoutPassword.id,
					username: userWithoutPassword.username,
					name: userWithoutPassword.name,
					role: userWithoutPassword.role,
				},
			};
		} catch {
			return { user: null };
		}
	});
