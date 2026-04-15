import { Elysia } from "elysia";
import { routes } from "./routes";

const app = new Elysia().use(routes).listen(3000);

console.log("Server is running on http://localhost:3000");

export type App = typeof app;
