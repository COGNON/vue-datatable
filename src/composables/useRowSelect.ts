import type { VSelectedRow, VRow, VSelectionModes, DataTableProps } from 'src/components/types';
import { ref } from 'vue';

export default function useRowSelect(props: DataTableProps) {
  const selected = ref<VRow[]>([]);
  const selectedByKey = ref<VSelectedRow>({});

  function updateSelected(row: VRow, selection: VSelectionModes) {
    if (!props.rowKey) return [];

    const keyVal = row[props.rowKey];

    if (selection === 'single') {
      // replace selections with the given row
      selected.value = [row];
      selectedByKey.value = { [keyVal]: true };
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
    if (!props.rowKey) return;

    if (isAllSelected) {
      // spread to remove reactivity
      selected.value = [...props.rows];
      props.rows.forEach((row) => (selectedByKey.value[row[props.rowKey]] = true));
    } else {
      // replace object & array with empty
      selected.value = [];
      selectedByKey.value = {};
    }
  }

  return { selected, selectedByKey, updateSelected, onSelectAll };
}
