import { useState } from 'react'
import { type ActionState, type Action } from '@/lib/safe-action'

interface ActionHookOptions<TOutput> {
  onSuccess?: (data: TOutput) => void
  onError?: (error: string) => void
}

interface ActionHookResult<TInput, TOutput> {
  execute: (input: TInput) => Promise<void>
  result: TOutput | null
  status: 'idle' | 'loading' | 'success' | 'error'
}

export function useAction<TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options?: ActionHookOptions<TOutput>
): ActionHookResult<TInput, TOutput> {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<TOutput | null>(null)

  const execute = async (input: TInput) => {
    try {
      setStatus('loading')
      const response = await action(input)
      
      if (response.error) {
        setStatus('error')
        options?.onError?.(response.error)
      } else {
        setStatus('success')
        setResult(response.data)
        options?.onSuccess?.(response.data!)
      }
    } catch (error) {
      setStatus('error')
      options?.onError?.(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return {
    execute,
    result,
    status
  }
}