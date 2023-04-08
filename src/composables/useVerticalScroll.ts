import { ref } from 'vue';

export default function useVerticalScroll() {
  const tbodyScrollRef = ref<HTMLElement | undefined>();
  const scrollTop = ref(0);

  const onVScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const top = target.scrollTop;
    scrollTop.value = top;
    if (tbodyScrollRef.value) tbodyScrollRef.value.scrollTop = top;
  };

  function handleVScrollEvent(e: MouseEvent, attach: boolean) {
    if (attach) {
      tbodyScrollRef.value?.removeEventListener('scroll', onVScroll);
      e.target?.addEventListener('scroll', onVScroll);
    } else {
      e.target?.removeEventListener('scroll', onVScroll);
      tbodyScrollRef.value?.addEventListener('scroll', onVScroll);
    }
  }

  return { tbodyScrollRef, scrollTop, onVScroll, handleVScrollEvent };
}
