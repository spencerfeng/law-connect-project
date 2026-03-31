"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { promptRuns, generatedItems } from "@/db/schema"
import { runPrompt } from "@/lib/llm"

export async function createRun(prompt: string) {
  const runId = uuidv4()

  await db.insert(promptRuns).values({
    id: runId,
    prompt,
    status: "pending",
  })

  try {
    const items = await runPrompt(prompt)

    await db.insert(generatedItems).values(
      items.map((item) => ({
        id: uuidv4(),
        promptRunId: runId,
        title: item.title,
        content: item.content,
        category: item.category ?? null,
        priority: item.priority ?? null,
        tags: item.tags,
        position: item.position,
        isDeleted: false,
      }))
    )

    await db
      .update(promptRuns)
      .set({ status: "completed" })
      .where(eq(promptRuns.id, runId))
  } catch (error) {
    await db
      .update(promptRuns)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
      .where(eq(promptRuns.id, runId))
  }

  revalidatePath("/runs", "layout")
  return { runId }
}
