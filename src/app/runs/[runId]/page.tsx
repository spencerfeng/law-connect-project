import { notFound } from "next/navigation"
import { eq, and, asc } from "drizzle-orm"
import { db } from "@/db"
import { promptRuns, generatedItems } from "@/db/schema"
import { PromptBanner } from "@/components/main/PromptBanner"
import { ItemsGrid } from "@/components/main/ItemsGrid"

export default async function RunPage({
  params,
}: {
  params: Promise<{ runId: string }>
}) {
  const { runId } = await params

  const run = await db.query.promptRuns.findFirst({
    where: eq(promptRuns.id, runId),
  })

  if (!run) notFound()

  const items = await db
    .select()
    .from(generatedItems)
    .where(
      and(
        eq(generatedItems.promptRunId, run.id),
        eq(generatedItems.isDeleted, false)
      )
    )
    .orderBy(asc(generatedItems.position))

  return (
    <div className="flex flex-col gap-4 p-6">
      <PromptBanner run={run} />
      {run.status === "failed" ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {run.errorMessage ?? "An unknown error occurred."}
        </div>
      ) : (
        <ItemsGrid items={items} />
      )}
    </div>
  )
}
