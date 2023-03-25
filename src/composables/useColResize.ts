import { VColumn } from 'src/components/DataTable/types';
import { getColIdx } from 'src/components/utils';
import { ref } from 'vue';

export default function useColResize() {
  const resizerRef = ref<HTMLElement | undefined>();
  const rootRef = ref<HTMLElement | undefined>();
  const scrollLeft = ref(0);
  const resizingCol = ref(false);

  let curColEl: HTMLElement | null = null;
  let curColResizing: VColumn | null = null;

  let x = 0;
  let diffX = 0;

  const onColResizeStart = (e: MouseEvent, col: VColumn,columns:) => {
    e.preventDefault();

    resizingCol.value = true;
    x = e.clientX;
    curColResizing = col;
    curColEl = (e.target as HTMLElement).parentElement;

    document.addEventListener('mousemove', onColResizeMove);
    document.addEventListener('mouseup', onColResizeEnd);
  };

  const onColResizeMove = (e: MouseEvent) => {
    if (!(rootRef.value && resizerRef.value)) return;
    e.preventDefault();
    diffX = e.clientX - x;

    resizerRef.value.setAttribute(
      'style',
      ` height: ${rootRef.value.clientHeight}px; left: ${e.pageX}px; display:block;`
    );
  };

  const onColResizeEnd = () => {
    if (!(curColResizing && resizerRef.value && curColEl && rootRef.value)) return;

    resizingCol.value = false;
    const colIdx = getColIdx(curColResizing.name);

    if (colIdx > -1) {
      const maxScrollWidth = colWidths.value - rootRef.value.clientWidth;
      if (diffX < 0 && scrollLeft.value >= maxScrollWidth) {
        scrollLeft.value = Math.max(0, scrollLeft.value + diffX);
      }
      processedColumns.value[colIdx].width = curColEl.offsetWidth + diffX;
    }

    resizerRef.value.style.display = 'none';

    document.removeEventListener('mousemove', onColResizeMove);
    document.removeEventListener('mouseup', onColResizeEnd);
  };

  return {onColResizeStart,resizerRef,rootRef}
}
