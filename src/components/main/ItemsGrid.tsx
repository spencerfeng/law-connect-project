import type { InferSelectModel } from "drizzle-orm"
import type { generatedItems } from "@/db/schema"
import { ItemCard } from "./ItemCard"

type Item = InferSelectModel<typeof generatedItems>

export function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No items generated.</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
