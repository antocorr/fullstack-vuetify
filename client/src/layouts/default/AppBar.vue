<template>
  <v-app-bar>
    <v-app-bar-nav-icon variant="text" @click.stop="openDrawer('left')"></v-app-bar-nav-icon>
    <v-app-bar-title>
      {{ websitename }}    
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
  </v-app-bar>
</template>
<script lang="ts">
import bubble from "@/lib/Bubble"
export default{
  props: ['websitename'],
  mounted(){
  },
  methods: {
    openDrawer(side: string){
      bubble.events.topic("dashboard").emit("open-drawer", side);
    }
  }
}
</script>