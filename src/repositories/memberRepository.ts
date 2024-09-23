import { MySql2Database } from "drizzle-orm/mysql2";
import { books, favorites, members } from "../drizzle/schema";
import { eq, like, SQL, sql, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { IMember, IMemberBase } from "@/lib/models";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";

export class MemberRepository {
  constructor(private db: VercelPgDatabase<typeof schema>) {}

  private buildWhereConditions(search?: string): SQL | undefined {
    if (search) {
      return sql`${like(members.firstName, `%${search}%`)} OR ${like(
        members.lastName,
        `%${search}%`
      )} OR ${like(members.email, `%${search}%`)}`;
    }
    return undefined;
  }

  async createMember(formData: FormData): Promise<string | null> {
    try {
      console.log("-----------------------------------------", formData);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const password = formData.get("password") as string;

      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("formdata", formData);
      await this.db.insert(members).values({
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        password: hashedPassword,
        role: "librarian",
      });

      return null;
    } catch (error) {
      console.error(error);
      return "Failed to create member repo";
    }
  }

  async updateMember(id: number, formData: FormData): Promise<string | null> {
    try {
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phoneNumber") as string;
      const role = formData.get("role") as "librarian" | "member";

      await this.db
        .update(members)
        .set({
          firstName,
          lastName,
          email,
          phoneNumber: phone,
          role,
        })
        .where(eq(members.id, id));

      return null;
    } catch (error) {
      console.error(error);
      return "Failed to update member";
    }
  }

  async deleteMember(id: number): Promise<string | null> {
    try {
      await this.db.delete(members).where(eq(members.id, id));
      return null;
    } catch (error) {
      console.error(error);
      return "Failed to delete member";
    }
  }

  async getMemberData(searchParams: { page?: string; search?: string }) {
    const page = parseInt(searchParams.page || "1");
    const search = searchParams.search || "";
    const membersPerPage = 10;

    const whereConditions = this.buildWhereConditions(search);

    const [totalMembers, paginatedMembers] = await Promise.all([
      this.db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(members)
        .where(whereConditions)
        .then((res) => res[0]),
      this.db
        .select()
        .from(members)
        .where(whereConditions)
        .limit(membersPerPage)
        .offset((page - 1) * membersPerPage),
    ]);

    const totalPages = Math.ceil(totalMembers.count / membersPerPage);

    return {
      members: paginatedMembers as IMember[],
      currentPage: page,
      totalPages,
    };
  }

  async getMemberByEmail(email: string): Promise<IMember> {
    const result = await this.db
      .select()
      .from(members)
      .where(eq(members.email, email))
      .limit(1);
    return result[0] as IMember;
  }
  private async getMemberByEmailOrThrow(email: string): Promise<IMember> {
    const member = await this.getMemberByEmail(email);
    if (!member) {
      throw new Error("Member not found");
    }
    return member;
  }

  async updateProfile(data: Partial<IMemberBase>): Promise<void> {
    const session = await auth();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await this.db
      .update(members)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber!,
      })
      .where(eq(members.email, data.email!));
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const session = await auth();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const user = await this.getMemberByEmail(session.user!.email!);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.db
      .update(members)
      .set({ password: hashedPassword })
      .where(eq(members.email, session.user!.email!));
  }

  async getUserDetails(session: any) {
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const { name, email, image } = session.user;

    try {
      const userDetails = await this.getMemberByEmail(email!);
      if (!userDetails) {
        throw new Error("User details not found in the database");
      }

      const { firstName, lastName, phoneNumber, role } = userDetails;

      return {
        name,
        email,
        image,
        firstName,
        lastName,
        phoneNumber,
        role,
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  /**
   * favorites table actions
   * @param memberId
   * @param bookId
   */
  async addFavorite(memberId: number, bookId: number): Promise<void> {
    await this.db.insert(favorites).values({ memberId, bookId });
  }

  async removeFavorite(memberId: number, bookId: number): Promise<void> {
    await this.db
      .delete(favorites)
      .where(
        and(eq(favorites.memberId, memberId), eq(favorites.bookId, bookId))
      );
  }

  async getFavorites(memberId: number) {
    return await this.db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        isbnNo: books.isbnNo,
        imageUrl: books.imageUrl,
      })
      .from(favorites)
      .innerJoin(books, eq(favorites.bookId, books.id))
      .where(eq(favorites.memberId, memberId));
  }

  async isFavorite(memberId: number, bookId: number): Promise<boolean> {
    const result = await this.db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.memberId, memberId), eq(favorites.bookId, bookId))
      )
      .limit(1);
    return result.length > 0;
  }
  async getMemberById(id: number): Promise<IMember | undefined> {
    if (!id) {
      return undefined;
    }
    const [member] = await this.db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);
    return member as IMember;
  }
}
