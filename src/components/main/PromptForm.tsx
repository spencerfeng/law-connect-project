"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createRun } from "@/actions/prompt-runs"
import { MODELS, DEFAULT_MODEL, type ModelId } from "@/lib/llm"

const modelsByProvider = MODELS.reduce<Record<string, typeof MODELS[number][]>>(
  (acc, m) => {
    ;(acc[m.provider] ??= []).push(m)
    return acc
  },
  {}
)

export function PromptForm({ defaultValue = "" }: { defaultValue?: string }) {
  const [prompt, setPrompt] = useState(defaultValue)
  const [modelId, setModelId] = useState<ModelId>(DEFAULT_MODEL)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    startTransition(async () => {
      const { runId } = await createRun(prompt, modelId)
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
      <div className="flex items-center justify-end gap-2">
        <Select value={modelId} onValueChange={(v) => setModelId(v as ModelId)} disabled={isPending}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(modelsByProvider).map(([provider, models]) => (
              <SelectGroup key={provider}>
                <SelectLabel>{provider}</SelectLabel>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isPending || !prompt.trim()}>
          {isPending ? "Generating…" : "Run"}
        </Button>
      </div>
    </form>
  )
}
