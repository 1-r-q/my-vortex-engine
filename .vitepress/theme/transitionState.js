import { reactive } from 'vue'
import { useRouter } from 'vitepress'

export const transitionState = reactive({
  isTransitioning: false,
  type: '', // 'gear-wipe' | 'blast-door' | 'crt-blink'
  phase: 'idle', // 'idle' | 'in' | 'out'
})

export function usePageTransition() {
  const router = useRouter()

  const startTransition = (type, targetUrl) => {
    if (transitionState.isTransitioning) return

    transitionState.isTransitioning = true
    transitionState.type = type
    // transitionState.phase = 'in' // Removed immediate set

    // 0. Wait for DOM mount (v-if)
    setTimeout(() => {
      transitionState.phase = 'in'
    }, 50)

    // 1. Animation IN (Cover Screen)
    setTimeout(() => {
      // 2. Navigate
      if (router) {
        try {
          router.go(targetUrl)
        } catch (e) {
          window.location.href = targetUrl
        }
      } else {
        window.location.href = targetUrl
      }

      // 3. Animation OUT (Reveal Screen)
      // Give a small buffer for page load/mount
      setTimeout(() => {
        transitionState.phase = 'out'
        
        // 4. Cleanup
        setTimeout(() => {
          transitionState.isTransitioning = false
          transitionState.phase = 'idle'
        }, 1500) // Match CSS transition time
      }, 200)
    }, 1500) // Match CSS transition time
  }

  return {
    transitionState,
    startTransition
  }
}
