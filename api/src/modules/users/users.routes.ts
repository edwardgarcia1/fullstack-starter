import { Elysia } from "elysia";
import { findUserById, getAllUsers } from "./service";
import { jwtMiddleware } from "../../middlewares/jwt";
import { rateLimitMiddleware } from "../../middlewares/rateLimit";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
} from "../../middlewares/error";
import { extractAndVerifyToken } from "../../shared/auth";

export const userRoutes = new Elysia({ prefix: "/users" })
    .use(rateLimitMiddleware)
    .use(jwtMiddleware)
    .get("/", async ({ jwt, headers, cookie, rateLimit, limited }) => {
        if (limited) {
            throw new BadRequestError("Rate limit exceeded");
        }

        const decodedUser = await extractAndVerifyToken(jwt, headers, cookie);

        // Role-based access control
        if (decodedUser.role !== "superadmin") {
            throw new ForbiddenError("Insufficient permissions");
        }

        const users = await getAllUsers();
        return users.map(({ password, ...rest }) => rest);
    })
    .get("/profile", async ({ jwt, headers, cookie }) => {
        const decodedUser = await extractAndVerifyToken(jwt, headers, cookie);

        const userProfile = await findUserById(decodedUser.id);
        if (!userProfile) {
            throw new NotFoundError("User not found");
        }
        const { password, ...rest } = userProfile;
        return rest;
    });
