"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { generatedItems } from "@/db/schema"

type UpdateItemInput = {
  title: string
  content: string
  category: string | null
  priority: "low" | "medium" | "high" | null
  tags: string[]
}

export async function updateItem(id: string, data: UpdateItemInput) {
  await db
    .update(generatedItems)
    .set({
      ...data,
      editedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(generatedItems.id, id))

  revalidatePath("/runs", "layout")
}

export async function softDeleteItem(id: string) {
  await db
    .update(generatedItems)
    .set({
      isDeleted: true,
      updatedAt: new Date(),
    })
    .where(eq(generatedItems.id, id))

  revalidatePath("/runs", "layout")
}
