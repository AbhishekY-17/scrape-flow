"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

console.log("Prisma instance:", prisma); // Debug log

export async function GetWorkflowsForUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized: User is not authenticated.");
  }

  return prisma.workflow.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
}