import type { VColumn } from 'src/components/types';
import { ref } from 'vue';

export default function useColResize() {
  const resizerRef = ref<HTMLElement | undefined>();
  const rootRef = ref<HTMLElement | undefined>();
  const resizingCol = ref(false);
  const widthChanged = ref(0);

  let curColEl: HTMLElement | null = null;
  let curColResizing: VColumn | null = null;

  let x = 0;
  let diffX = 0;

  const onColResizeStart = (e: MouseEvent, col: VColumn) => {
    e.preventDefault();

    resizingCol.value = true;
    x = e.clientX - rootRef.value?.offsetLeft;
    curColResizing = col;
    curColEl = (e.target as HTMLElement).parentElement;

    document.addEventListener('mousemove', onColResizeMove);
    document.addEventListener('mouseup', onColResizeEnd);
  };

  const onColResizeMove = (e: MouseEvent) => {
    if (!(rootRef.value && resizerRef.value)) return;
    e.preventDefault();
    diffX = e.clientX - x - rootRef.value?.offsetLeft;

    resizerRef.value.setAttribute(
      'style',
      ` height: ${rootRef.value.clientHeight}px; left: ${
        e.pageX - rootRef.value?.offsetLeft
      }px; top:0px; display:block;`
    );
  };

  const onColResizeEnd = () => {
    if (!(curColResizing && resizerRef.value && curColEl && rootRef.value)) return;

    resizingCol.value = false;
    curColResizing.width = curColEl.offsetWidth + diffX;
    widthChanged.value = diffX;
    resizerRef.value.style.display = 'none';

    document.removeEventListener('mousemove', onColResizeMove);
    document.removeEventListener('mouseup', onColResizeEnd);
  };

  return { onColResizeStart, resizerRef, rootRef, widthChanged };
}
