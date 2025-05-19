import { z } from 'zod'

export type ActionState<TOutput> = {
  data: TOutput | null
  error: string | null
}

export type Action<TInput, TOutput> = (input: TInput) => Promise<ActionState<TOutput>>

export function action<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedInput: TInput) => Promise<ActionState<TOutput>>
): Action<TInput, TOutput> {
  return async (input: TInput) => {
    try {
      const validatedInput = await schema.parseAsync(input)
      return handler(validatedInput)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          data: null,
          error: error.errors[0].message
        }
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }
} 