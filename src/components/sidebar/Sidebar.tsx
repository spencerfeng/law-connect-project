import Link from "next/link"
import { desc } from "drizzle-orm"
import { db } from "@/db"
import { promptRuns } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { RunListItem } from "./RunListItem"

export async function Sidebar() {
  const runs = await db.select().from(promptRuns).orderBy(desc(promptRuns.createdAt))

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">LawConnect</span>
      </div>
      <div className="px-3 py-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/runs">+ New run</Link>
        </Button>
      </div>
      <nav className="flex flex-col gap-1 overflow-y-auto px-2 pb-4">
        {runs.map((run, index) => (
          <RunListItem key={run.id} run={run} index={runs.length - 1 - index} />
        ))}
      </nav>
    </aside>
  )
}
