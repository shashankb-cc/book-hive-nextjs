import { AppEnvs } from "../../read-env";
import mysql from "mysql2/promise";
import { members } from "../drizzle/schema";
import { eq, Placeholder, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { IMember } from "./models";

const pool = mysql.createPool(AppEnvs.DATABASE_URL);
const db = drizzle(pool);

// Function to find user by email
export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(members)
    .where(eq(members.email, email));
  return user as IMember;
};
// Function to insert a new user
export const createUser = async (userData: {
  firstName: string | SQL<unknown> | Placeholder<string, any>;
  lastName: string | SQL<unknown> | Placeholder<string, any>;
  email: string | SQL<unknown> | Placeholder<string, any>;
  phoneNumber: string | SQL<unknown> | Placeholder<string, any>;
  password: string | SQL<unknown> | Placeholder<string, any>;
  id?: number | SQL<unknown> | Placeholder<string, any> | undefined;
  role?:
    | SQL<unknown>
    | "librarian"
    | "member"
    | Placeholder<string, any>
    | null
    | undefined;
}) => {
  const result = await db.insert(members).values(userData);
  return result;
};
