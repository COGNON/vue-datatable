<template>
  <div ref="root" class="vdt-tbody" :style="rootStyle" @scroll="onScroll">
    <div ref="viewport" class="vdt-viewscroller" :style="viewportStyle">
      <div ref="spacer" class="vdt-spacer" :style="spacerStyle">
        <slot name="content" :visible-rows="visibleRows" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VColumn } from './types';

interface VScrollerProps {
  rows: any[];
  columns: VColumn[];
  lineHeight: number;
  rootHeight: number;
  virtualScrollNodePadding: number;
}

const props = defineProps<VScrollerProps>();

const root = ref(null);
const viewport = ref(null);
const spacer = ref(null);

const rowCount = computed(() => props.rows.length);

// # of rows * row height for the total size of the table
const viewportHeight = computed(() => rowCount.value * props.lineHeight);

const scrollTop = ref(0);
const startNode = computed(() => getStartNode(scrollTop.value));
const visibleNodesCount = computed(() =>
  getVisibleNodesCount(startNode.value, rowCount.value)
);
const offsetY = computed(() => startNode.value * props.lineHeight);

function getVisibleNodes(
  startNode: number,
  visibleNodesCount: number
): unknown[] {
  return props.rows.slice(startNode, visibleNodesCount);
}

function getStartNode(scrollTop: number): number {
  let tmpStart =
    Math.floor(scrollTop / props.lineHeight) - props.virtualScrollNodePadding;
  return Math.max(0, tmpStart);
}

function getVisibleNodesCount(startNode: number, rowCount: number): number {
  const count =
    Math.ceil(props.rootHeight / props.lineHeight) +
    2 * props.virtualScrollNodePadding;
  return Math.min(rowCount - startNode, count);
}

function onScroll(event: UIEvent) {
  const target = event.target as HTMLElement;
  scrollTop.value = target.scrollTop;
}

const visibleRows = computed<unknown[]>(() =>
  getVisibleNodes(startNode.value, startNode.value + visibleNodesCount.value)
);

const spacerStyle = computed(() => {
  return { transform: `translateY(${offsetY.value}px)` };
});

const viewportStyle = computed(() => {
  return {
    overflow: 'hidden',
    height: viewportHeight.value + 'px',
    position: 'relative',
  };
});

const rootStyle = computed(() => {
  return {
    height: props.rootHeight + 'px',
    overflow: 'auto',
  };
});
</script>
