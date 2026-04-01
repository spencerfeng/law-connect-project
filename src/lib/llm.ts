import { generateText, Output } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

export const MODELS = [
  { id: "anthropic/claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", provider: "Anthropic" },
  { id: "anthropic/claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "Anthropic" },
  { id: "anthropic/claude-opus-4-6", label: "Claude Opus 4.6", provider: "Anthropic" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI" },
  { id: "openai/gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { id: "openai/gpt-4.1", label: "GPT-4.1", provider: "OpenAI" },
] as const

export type ModelId = (typeof MODELS)[number]["id"]

export const DEFAULT_MODEL: ModelId = "anthropic/claude-haiku-4-5-20251001"

function resolveModel(modelId: ModelId) {
  const [provider, model] = modelId.split("/") as [string, string]
  if (provider === "anthropic") return createAnthropic()(model)
  if (provider === "openai") return createOpenAI()(model)
  throw new Error(`Unknown provider: ${provider}`)
}

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

export async function runPrompt(prompt: string, modelId: ModelId = DEFAULT_MODEL) {
  const { output } = await generateText({
    model: resolveModel(modelId),
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
