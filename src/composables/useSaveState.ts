import type { VColumn, VFilter, VSorter, VState } from '../components/types';

export default function useSaveState() {
  function getState(columns: Required<VColumn>[], sorters: VSorter[], filters: VFilter): VState {
    console.log(columns);
    const saveCols = columns.map((col) => {
      return { colId: col.colId, width: col.width || 150 };
    });

    return {
      columns: saveCols,
      sorters: sorters,
      filters: filters
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
