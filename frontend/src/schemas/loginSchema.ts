import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type LoginSchema = z.infer<typeof loginSchema>
