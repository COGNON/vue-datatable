import type { VColumn } from '../components/types';
import { getColIdx } from '../components/utils';
import { ref } from 'vue';

export default function useColMove() {
  const dropColIndicatorDown = ref<HTMLElement | undefined>();
  const dropColIndicatorUp = ref<HTMLElement | undefined>();

  const onColDragStart = (e: DragEvent) => {
    const sourceCol = e.target as HTMLElement;
    sourceCol.style.opacity = '0.4';
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', sourceCol.getAttribute('name') as string);
    }
  };

  const onColDrop = (e: DragEvent, columns: VColumn[]): VColumn[] => {
    e.preventDefault();
    e.stopPropagation();

    const targetCol = getClosestColEl(e.target as HTMLElement);
    if (!targetCol) return columns;

    const data = e.dataTransfer?.getData('text');
    const [srcField] = data?.split('~~');
    const destField = targetCol.getAttribute('name');

    if (!(srcField && destField)) return columns;

    const root = (e.target as HTMLElement).closest('.vdt--root-wrapper') as HTMLElement;
    if (!root) return columns;

    if (srcField !== destField) {
      const srcColIdx = getColIdx(columns, srcField);
      const sourceCol = columns.splice(srcColIdx, 1);
      const destColIdx = getColIdx(columns, destField);
      const colCenter = targetCol.offsetLeft + root.offsetLeft + targetCol.offsetWidth / 2;

      if (colCenter < e.clientX) {
        // move after
        columns.splice(destColIdx + 1, 0, sourceCol[0]);
      } else {
        // move before
        columns.splice(destColIdx, 0, sourceCol[0]);
      }
    }

    return columns;
  };

  const onColDragEnd = (e: DragEvent) => {
    if (!(dropColIndicatorDown.value && dropColIndicatorUp.value)) return;
    (e.target as HTMLElement).style.opacity = '1';

    dropColIndicatorDown.value.style.display = 'none';
    dropColIndicatorUp.value.style.display = 'none';
  };

  const iconDownTop = ref(0);
  const iconUpTop = ref(0);
  const iconYLocation = ref(0);

  const onColDragOver = (e: DragEvent) => {
    // fires off the element being hovered over
    e.preventDefault(); // allows dropping

    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

    if (!(dropColIndicatorDown.value && dropColIndicatorUp.value)) return;

    const targetCol = getClosestColEl(e.target as HTMLElement);
    if (!targetCol) return;

    const root = (e.target as HTMLElement).closest('.vdt--root-wrapper') as HTMLElement;
    if (!root) return;

    const left = targetCol.offsetLeft;
    const top = (targetCol.offsetParent as HTMLElement).offsetTop;

    const colWidth = targetCol.offsetWidth;
    const colCenter = left + colWidth / 2;
    const iconHeight = dropColIndicatorDown.value.clientHeight / 2;
    const iconWidth = dropColIndicatorDown.value.clientWidth / 2;

    iconDownTop.value = top - iconHeight;
    iconUpTop.value = top + targetCol.clientHeight - iconHeight;

    if (colCenter < e.clientX) {
      // move after
      iconYLocation.value = left + colWidth - iconWidth;
    } else {
      // move before
      iconYLocation.value = left - iconWidth;
    }

    dropColIndicatorDown.value.style.display = 'block';
    dropColIndicatorUp.value.style.display = 'block';
    return;
  };

  const getClosestColEl = (target: HTMLElement): HTMLElement | null => target.closest('.vdt--th');

  return {
    dropColIndicatorDown,
    dropColIndicatorUp,
    iconDownTop,
    iconUpTop,
    iconYLocation,
    onColDragStart,
    onColDragOver,
    onColDragEnd,
    onColDrop
  };
}
