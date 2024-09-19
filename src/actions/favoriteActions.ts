"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { MemberRepository } from "@/repositories/memberRepository";

export async function addFavorite(bookId: number) {
  const memberRepository = new MemberRepository(db);

  const session = await auth();
  const member = await memberRepository.getMemberByEmail(session?.user?.email!);
  if (!member) {
    return { error: "Member not found" };
  }

  await memberRepository.addFavorite(member.id, bookId);
  return { success: true };
}

export async function removeFavorite(bookId: number) {
  const memberRepository = new MemberRepository(db);

  const session = await auth();
  const member = await memberRepository.getMemberByEmail(session?.user?.email!);
  if (!member) {
    return { error: "Member not found" };
  }

  await memberRepository.removeFavorite(member.id, bookId);
  return { success: true };
}

export async function getFavorites() {
  const memberRepository = new MemberRepository(db);

  const session = await auth();
  const member = await memberRepository.getMemberByEmail(session?.user?.email!);
  if (!member) {
    return { error: "Member not found" };
  }

  const favorites = await memberRepository.getFavorites(member.id);
  return { favorites };
}
