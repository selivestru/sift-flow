import { useEffect, useRef } from 'react'

export const useDebounceEffect = (
  effect: React.EffectCallback,
  delay: number,
  deps?: React.DependencyList,
) => {
  const mountedRef = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cleanupRef = useRef<ReturnType<React.EffectCallback>>(undefined)
  const effectRef = useRef(effect)
  const delayRef = useRef(delay)

  // oxlint-disable-next-line react/refs
  effectRef.current = effect
  // oxlint-disable-next-line react/refs
  delayRef.current = delay

  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    timeoutRef.current = setTimeout(() => {
      cleanupRef.current = effectRef.current()
    }, delayRef.current)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      if (typeof cleanupRef.current === 'function') cleanupRef.current()
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
