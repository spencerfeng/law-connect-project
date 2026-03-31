"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InferSelectModel } from "drizzle-orm"
import type { promptRuns } from "@/db/schema"

type Run = InferSelectModel<typeof promptRuns>

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

const statusVariant: Record<Run["status"], "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  completed: "default",
  failed: "destructive",
}

const statusLabel: Record<Run["status"], string> = {
  pending: "pending",
  completed: "✓",
  failed: "✗",
}

export function RunListItem({ run, index }: { run: Run; index: number }) {
  const pathname = usePathname()
  const isActive = pathname === `/runs/${run.id}`

  return (
    <Link
      href={`/runs/${run.id}`}
      className={cn(
        "flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate">Run #{index + 1}</span>
        <Badge variant={statusVariant[run.status]} className="shrink-0">
          {statusLabel[run.status]}
        </Badge>
      </div>
      <span className="text-xs text-muted-foreground">
        {formatRelativeTime(run.createdAt)}
      </span>
    </Link>
  )
}
