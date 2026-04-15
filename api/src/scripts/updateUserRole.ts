import { db } from "../config/db";
import { users } from "../modules/users/schema";
import { eq } from "drizzle-orm";

const username = process.argv[2];
const role = process.argv[3];

if (!username || !role) {
  console.error("Usage: bun src/scripts/updateUserRole.ts <username> <role>");
  process.exit(1);
}

try {
  await db.update(users).set({ role: role as "admin" | "user" }).where(eq(users.username, username));
  console.log(`Updated role for user '${username}' to '${role}'`);
} catch (error) {
  console.error("Failed to update user role:", error);
  process.exit(1);
}
