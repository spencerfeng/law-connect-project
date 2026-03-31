"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PromptForm } from "./PromptForm"
import type { InferSelectModel } from "drizzle-orm"
import type { promptRuns } from "@/db/schema"

type Run = InferSelectModel<typeof promptRuns>

const statusVariant: Record<Run["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  completed: "default",
  failed: "destructive",
}

export function PromptBanner({ run }: { run: Run }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="rounded-lg border bg-muted/40 p-4">
        <PromptForm defaultValue={run.prompt} />
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{run.prompt}</p>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[run.status]}>{run.status}</Badge>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0" onClick={() => setIsEditing(true)}>
        Edit &amp; Re-run
      </Button>
    </div>
  )
}
