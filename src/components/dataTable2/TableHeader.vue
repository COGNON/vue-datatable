<template>
  <div class="vdt--thead-wrapper" role="presentation" :style="theadStyle">
    <div class="vdt--thead" role="presentation">
      <div
        class="vdt--thead-container"
        role="rowgroup"
        :style="theadContainerStyle"
      >
        <div
          class="vdt--thead-tr"
          role="row"
          aria-rowindex="1"
          :style="theadTrStyle"
        >
          <header-cell
            v-for="(col, colIdx) in columns"
            :key="col.field"
            :col="col"
            :aria-colindex="colIdx + 1"
            :style="{ width: `${col.width}px` }"
            @on-resize-start="(e) => $emit('onResizeStart', e, col)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue';
import { VColumn } from '../DataTable/types';
import HeaderCell from './HeaderCell.vue';

const props = defineProps<{
  theadContainerStyle: CSSProperties;
  theadTrStyle: CSSProperties;
  columns: VColumn[];
  rowHeight: number;
}>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent): void;
  (e: 'onResizeStart', event: MouseEvent, col: VColumn): void;
}>();

// TODO: should be lineheight if no filter row or lineheight + filter row height. Maybe user-defined?
const theadStyle = {
  height: `${props.rowHeight}px`,
  minHeight: `${props.rowHeight}px`,
};
</script>
