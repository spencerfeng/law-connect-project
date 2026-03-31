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
      position: z.number(),
    })
  ),
})

export async function runPrompt(prompt: string) {
  const { output } = await generateText({
    model: anthropic("claude-haiku-4-5-20251001"),
    output: Output.object({ schema: itemSchema }),
    system:
      "You are a legal document analysis assistant. Given a user prompt, extract and generate MULTIPLE structured analysis items (aim for 5–10). " +
      "Each item must have: a concise title, detailed content, a category (e.g. 'Risk', 'Clause', 'Action Item', 'Obligation', 'Deadline'), " +
      "a priority (low/medium/high), relevant tags as an array of short strings, and a position integer for display order (starting at 1). " +
      "Always return multiple items covering different aspects of the prompt.",
    prompt,
  })
  return output.items
}
