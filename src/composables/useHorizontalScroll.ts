export default function useHorizontalScroll(emit) {
  function handleHScrollEvent(e: MouseEvent, attach: boolean) {
    if (attach) e.target?.addEventListener('scroll', onHScroll);
    else e.target?.removeEventListener('scroll', onHScroll);
  }

  const onHScroll = (event: Event) => emit('updateScroll', (event.target as HTMLElement).scrollLeft);

  return { handleHScrollEvent };
}
