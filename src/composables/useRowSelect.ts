import type { VSelectedRow, VRow, VSelectionModes } from 'src/components/types';
import { ref } from 'vue';

type Props = { rows: VRow[] };

export default function useRowSelect(props: Props) {
  const selected = ref<VRow[]>([]);
  const selectedByKey = ref<VSelectedRow>({});

  function updateSelected(row: VRow, selection: VSelectionModes) {
    const keyVal = row.index;

    if (selection === 'single') {
      // replace selections with the given row
      selected.value = [row];
      selectedByKey.value = { [row.index]: true };
    } else {
      if (selectedByKey.value[keyVal]) {
        // row was previously selected
        // delete from object
        delete selectedByKey.value[keyVal];

        // find & splice from array
        const selIdx = selected.value.findIndex((tmpRow) => tmpRow.index === keyVal);
        if (selIdx !== -1) selected.value.splice(selIdx, 1);
      } else {
        // row is not previously selected and this is multi-select, add to object & array
        selectedByKey.value[keyVal] = true;
        selected.value.push(row);
      }
    }

    return selected.value;
  }

  function onSelectAll(isAllSelected: boolean) {
    if (isAllSelected) {
      // spread to remove reactivity
      selected.value = [...props.rows];
      props.rows.forEach((row, idx) => (selectedByKey.value[idx] = true));
    } else {
      // replace object & array with empty
      selected.value = [];
      selectedByKey.value = {};
    }
  }

  return { selected, selectedByKey, updateSelected, onSelectAll };
}
