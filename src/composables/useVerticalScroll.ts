import { ref } from 'vue'

export default function useVerticalScroll() {
  const scrollTop = ref(0)

  const onVScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  return { scrollTop, onVScroll }
}
