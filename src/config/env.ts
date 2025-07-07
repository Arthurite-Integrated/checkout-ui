import { z } from "zod"


const EnvSchema = z.object({
  VITE_SERVER_URL: z.string(),
  VITE_CLIENT_URL: z.string(),
  VITE_AGENT: z.string(),
  BASE_URL: z.string(),
  DEV: z.boolean(),
  MODE: z.string(),
  PROD: z.boolean(),
  SSR: z.boolean(),
  VITE_TELEGRAM_BOT_URL: z.string()
})

export type EnvSchema = z.infer<typeof EnvSchema>

const env: Partial<EnvSchema> = { ...import.meta.env }

export default env