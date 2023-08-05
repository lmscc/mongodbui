import { useRef } from 'react'

export function useSyncEffect(fn, deps) {
  const dp = useRef([])
  function run() {
    dp.current = deps
    fn()
  }
  if (dp.current.length !== deps.length) {
    run()
  } else {
    for (let i = 0; i < deps.length; i++) {
      if (deps[i] !== dp.current[i]) {
        run()
        break
      }
    }
  }
}
