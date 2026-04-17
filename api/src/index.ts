import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { routes } from "./routes";

const app = new Elysia()
	.use(
		cors({
			origin: (request) => {
				const origin = request.headers.get("origin");
				if (!origin) return false;
				const allowedOrigins = process.env.CORS_ORIGIN
					? process.env.CORS_ORIGIN.split(",")
					: ["http://localhost:5173", "http://127.0.0.1:5173"];
				return allowedOrigins.includes(origin);
			},
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
		}),
	)
	.use(routes)
	.listen(3000);

console.log("Server is running on http://localhost:3000");

export type App = typeof app;
