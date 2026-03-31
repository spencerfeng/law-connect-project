import { redirect } from "next/navigation"
import { desc } from "drizzle-orm"
import { db } from "@/db"
import { promptRuns } from "@/db/schema"

export default async function Home() {
  const [latest] = await db
    .select({ id: promptRuns.id })
    .from(promptRuns)
    .orderBy(desc(promptRuns.createdAt))
    .limit(1)

  if (latest) {
    redirect(`/runs/${latest.id}`)
  }

  redirect("/runs")
}
