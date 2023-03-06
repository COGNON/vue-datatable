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
}

const props = withDefaults(defineProps<VScrollerProps>(), {
  rows: () => [],
  lineHeight: 48,
});

const root = ref(null);
const viewport = ref(null);
const spacer = ref(null);

const nodePadding = 20;
const rootHeight = 500;
const rowCount = computed(() => props.rows.length);
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
  let tmpStart = Math.floor(scrollTop / props.lineHeight) - nodePadding;
  return Math.max(0, tmpStart);
}

function getVisibleNodesCount(startNode: number, rowCount: number): number {
  const count =
    Math.ceil(viewportHeight.value / props.lineHeight) + 2 * nodePadding;
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
    height: rootHeight + 'px',
    overflow: 'auto',
  };
});
</script>
