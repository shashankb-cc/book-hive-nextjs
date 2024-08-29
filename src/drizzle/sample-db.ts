import "dotenv/config";
import { books, members, transactions } from "./schema";
import mysql from "mysql2/promise";
import { AppEnvs } from "../../read-env";
import { drizzle } from "drizzle-orm/mysql2";

async function main() {
  const pool = mysql.createPool(AppEnvs.DATABASE_URL);

  const db = drizzle(pool);

  await db.insert(members).values({
    firstName: "Shashank",
    lastName: "Patel",
    email: "samplemail@gmail.com",
    phoneNumber: "8528528523",
    password: "",
    role: "librarian",
  });
  const user = await db.select().from(members);
  console.log(user);
}
main();
