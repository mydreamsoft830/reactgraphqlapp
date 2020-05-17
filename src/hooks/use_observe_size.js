import { useEffect, useState } from 'react'

export const useObserveSize = ref => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return size
}
