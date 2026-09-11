import { useEffect, useState } from 'react'

const TYPING_SPEED = 80
const PAUSE_DURATION = 1500
const DELETING_SPEED = 40
const WAITING_DURATION = 500

type Phase = 'typing' | 'pausing' | 'deleting' | 'waiting'

export function useTypewriterPlaceholder(queries: string[]) {
  const [queryIndex, setQueryIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')

  useEffect(() => {
    const current = queries[queryIndex]

    const delay =
      phase === 'typing' ? TYPING_SPEED :
      phase === 'pausing' ? PAUSE_DURATION :
      phase === 'deleting' ? DELETING_SPEED :
      WAITING_DURATION

    const timer = setTimeout(() => {
      if (phase === 'typing') {
        if (charIndex < current.length) setCharIndex(charIndex + 1)
        else setPhase('pausing')
      } else if (phase === 'pausing') {
        setPhase('deleting')
      } else if (phase === 'deleting') {
        if (charIndex > 0) setCharIndex(charIndex - 1)
        else setPhase('waiting')
      } else {
        setQueryIndex((queryIndex + 1) % queries.length)
        setPhase('typing')
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [charIndex, phase, queryIndex, queries])

  return queries[queryIndex].slice(0, charIndex)
}