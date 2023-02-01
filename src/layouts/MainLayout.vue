<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> COGNON </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay bordered>
      <q-list>
        <q-item v-for="link in essentialLinks" :key="link.title" :to="link.to"
          >{{ link.title }}
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';

interface Link {
  title: string;
  caption: string;
  icon: string;
  to?: string;
  link?: string;
}

const essentialLinks: Link[] = [
  {
    title: 'Github',
    caption: 'github.com/cognon',
    icon: 'code',
    link: 'https://github.com/cognon',
  },
];

const leftDrawerOpen: Ref<boolean> = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
