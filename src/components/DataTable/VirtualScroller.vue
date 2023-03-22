<template>
  <div class="scroller-wrapper" :style="rootStyle" @scroll="onScroll">
    <slot name="before" />

    <div class="vdt-body">
      <div ref="viewport" class="vdt-viewscroller" :style="viewportStyle">
        <div ref="spacer" class="vdt-spacer" :style="spacerStyle">
          <slot name="content" :visible-rows="visibleRows" />
        </div>
      </div>

      <div
        class="vdt-body-vertical-scroller"
        :aria-hidden="true"
        :style="verticalScrollerStyle"
      >
        <div
          class="vdt-body-vertical-scroller-viewport"
          :style="verticalScrollerStyle"
        >
          <div
            class="vdt-body-vertical-scroller-container"
            :style="{ ...verticalScrollerStyle, ...viewportStyle }"
          />
        </div>
      </div>
    </div>

    <slot name="footer" />
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
  return { height: viewportHeight.value + 'px' };
});

const rootStyle = computed(() => {
  return { height: props.rootHeight + 'px' };
});

const verticalScrollerStyle = {
  width: '15px',
  maxWidth: '15px',
  minWidth: '15px',
};
</script>

<style lang="scss" scoped>
.scroller-wrapper {
  overflow: auto;
}
.vdt-viewscroller {
  position: relative;
  width: fit-content;
}
.vdt-body-vertical-scroller {
  height: 100%;
  display: flex;
  position: relative;
}
.vdt-body-vertical-scroller-viewport {
  overflow: hidden;
  overflow-y: scroll;
  position: relative;
  height: 100%;
  flex: 1 1 auto;
}
.vdt-body-vertical-scroller-container {
  position: relative;
}
.vdt-body {
  position: relative;
  display: flex;
  flex: 1 1 auto;
}
</style>
