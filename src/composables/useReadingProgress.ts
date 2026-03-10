import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useReadingProgress = () => {
  const progress = ref(0)

  const calc = () => {
    const doc = document.documentElement
    const scrollTop = window.scrollY || doc.scrollTop
    const height = doc.scrollHeight - window.innerHeight
    if (height <= 0) {
      progress.value = 0
      return
    }
    progress.value = Math.max(0, Math.min(1, scrollTop / height))
  }

  const onScroll = () => {
    // keep it lightweight
    calc()
  }

  onMounted(() => {
    calc()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { progress }
}
