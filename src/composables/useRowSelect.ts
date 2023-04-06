import { SelectedRow, VRow } from 'src/components/types';
import { ref } from 'vue';

export default function useRowSelect(props: any) {
  const selected = ref<VRow[]>([]);
  const selectedByKey = ref<SelectedRow>({});

  function updateSelected(row: any) {
    if (!props.rowKey) return;

    const keyVal = row[props.rowKey];

    if (selectedByKey.value[keyVal]) {
      delete selectedByKey.value[keyVal];
      const selIdx = selected.value.findIndex((tmpRow) => tmpRow[props.rowKey] === keyVal);
      if (selIdx !== -1) selected.value.splice(selIdx, 1);
    } else {
      selectedByKey.value[keyVal] = true;
      selected.value.push(row);
    }
  }

  function onSelectAll(isAllSelected: boolean) {
    if (!props.rowKey) return;

    if (isAllSelected) {
      // spread to remove reactivity
      selected.value = [...props.rows];
      props.rows.map((row: any) => (selectedByKey.value[row[props.rowKey]] = true));
    } else {
      selected.value = [];
      selectedByKey.value = {};
    }
  }

  return { selected, selectedByKey, updateSelected, onSelectAll };
}
