import { VColumn, VFilter, VSorter, VState } from 'src/components/types';

export default function useSaveState() {
  function getState(columns: VColumn[], sorters: VSorter[], filters: VFilter): VState {
    const saveCols = columns.map((col) => {
      return { name: col.name, width: col.width || 150 };
    });

    return {
      columns: saveCols,
      sorters: sorters,
      filters: filters,
    };
  }

  function saveState(stateKey: string, state: VState) {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function loadState(stateKey: string): VState | undefined {
    const state = localStorage.getItem(stateKey);
    if (state) return JSON.parse(state) as VState;
  }

  function clearState(stateKey: string) {
    localStorage.removeItem(stateKey);
  }

  return { getState, saveState, loadState, clearState };
}
