<template>
  <div class="vdt--tbody-viewport" role="presentation" @scroll="onVScroll">
    <slot
      :virtual-rows="visibleRows"
      :start-node="startNode"
      :offset-y="offsetY"
      :table-height="tbodyHeight"
      :spacer-style="spacerStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VRow, VColumn } from '../types'
import useVirtualScroll from '../../composables/useVirtualScroll'

const props = defineProps<{
  rows: VRow[]
  columns: VColumn[]
  rowHeight: number
  virtualScrollNodePadding: number
  rootHeight: number
  colWidths: number
  scrollLeft: number
  stripedRows: boolean
  expandedRowHeight: number
}>()

const { visibleRows, offsetY, startNode, tbodyHeight, onVScroll } = useVirtualScroll(props)

const spacerStyle = computed(() => tbodyHeight.value - visibleRows.value.length * props.rowHeight)
</script>
