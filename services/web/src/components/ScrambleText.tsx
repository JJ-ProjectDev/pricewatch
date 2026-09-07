import { useEffect, useState } from 'react'

const CHARS = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*'

export function ScrambleText({
  text,
  className
}: {
  text: string
  className?: string
}) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    let iteration = 0

    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, index) =>
            index < iteration ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join('')
      )

      if (iteration >= text.length) clearInterval(interval)
      iteration += 1 / 2
    }, 30)

    return () => clearInterval(interval)
  }, [text])

  return <span className={className}>{display}</span>
}