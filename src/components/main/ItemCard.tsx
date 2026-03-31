"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateItem, softDeleteItem } from "@/actions/generated-items"
import type { InferSelectModel } from "drizzle-orm"
import type { generatedItems } from "@/db/schema"

type Item = InferSelectModel<typeof generatedItems>

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "outline",
  medium: "secondary",
  high: "destructive",
}

export function ItemCard({ item }: { item: Item }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)
  const [isSaving, startSaving] = useTransition()
  const [isDeleting, startDeleting] = useTransition()

  function handleSave() {
    startSaving(async () => {
      await updateItem(item.id, {
        title,
        content,
        category: item.category,
        priority: item.priority,
        tags: item.tags,
      })
      setIsEditing(false)
    })
  }

  function handleDelete() {
    startDeleting(async () => {
      await softDeleteItem(item.id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.category && <Badge variant="secondary">{item.category}</Badge>}
          {item.priority && (
            <Badge variant={priorityVariant[item.priority] ?? "outline"}>
              {item.priority.toUpperCase()}
            </Badge>
          )}
          {item.tags.map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving…" : "Save"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "…" : "Delete"}
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            className="resize-none text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>
      ) : (
        <>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{content}</p>
        </>
      )}
    </div>
  )
}
