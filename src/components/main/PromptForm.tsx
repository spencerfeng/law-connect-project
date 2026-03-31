"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createRun } from "@/actions/prompt-runs"

export function PromptForm({ defaultValue = "" }: { defaultValue?: string }) {
  const [prompt, setPrompt] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    startTransition(async () => {
      const { runId } = await createRun(prompt)
      router.push(`/runs/${runId}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Paste or type your prompt here… e.g. 'Analyse this employment contract for risks.'"
        className="min-h-32 resize-none"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending || !prompt.trim()} className="self-end">
        {isPending ? "Generating…" : "Run"}
      </Button>
    </form>
  )
}
