import { generateText, Output } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const anthropic = createAnthropic()

const itemSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      category: z.string().nullable(),
      priority: z.enum(["low", "medium", "high"]).nullable(),
      tags: z.array(z.string()),
      position: z.number().int(),
    })
  ),
})

export async function runPrompt(prompt: string) {
  const { output } = await generateText({
    model: anthropic("claude-haiku-4-5-20251001"),
    output: Output.object({ schema: itemSchema }),
    prompt,
  })
  return output.items
}
