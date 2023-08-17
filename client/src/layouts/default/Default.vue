<template>
  <v-app>
    <default-bar websitename="Money Laundry" />
    <v-navigation-drawer theme="dark" v-model="drawerleft">
      <v-list>
        <v-list-item :prepend-icon="item.icon" :title="item.text" v-for="item in nav" @click="navigate(item)"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
import router from '@/router';
import bubble from '@/lib/Bubble';
const nav = ref([
  { text: "Home", value: "/", icon: "mdi-home" },
  { text: "Transactions", value: "/transactions", icon: "mdi-cash-multiple" }
])
const drawerleft = ref(false);
function navigate(item: any) {
  router.push(item.value)
}
bubble.events.topic("dashboard").on("open-drawer", (side: string) => {
  switch (side) {
    case "left":
      drawerleft.value = !drawerleft.value;
  }
})

</script>
