<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>COGNON</q-toolbar-title>

        <q-space />

        <q-btn round flat padding="0px" class="icon-link" href="https://github.com/cognon/vue-datatable">
          <q-icon :name="mdiGithub" size="md" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered :width="200">
      <q-list>
        <q-item v-for="link in navTree" :key="link.label" :to="link.to" clickable>
          <q-expansion-item
            v-if="link.children"
            expand-icon-toggle
            switch-toggle-side
            dense-toggle
            dense
            :label="link.label"
            :content-inset-level="1"
          >
            <q-list>
              <q-item v-for="item in link.children" :key="item.label" :to="link.to" clickable>
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
          <q-item-section v-else>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiGithub } from '@quasar/extras/mdi-v7';

const leftDrawerOpen = ref(true);

const navTree = ref([
  {
    label: 'Datatable',
    to: { name: 'datatable' },
    children: [
      {
        label: 'Basic',
        to: { name: 'datatable-basic' },
      },
    ],
  },
]);
</script>

<style scoped>
.icon-link {
  color: none;
}
</style>
