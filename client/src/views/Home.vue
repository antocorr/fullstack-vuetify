<template>
  <div class="pt-12">
    <div class="px-12">
      <v-combobox label="Combobox" :items="family" v-model="familiareScelto"></v-combobox>
      <div>
        <v-btn :loading="loading" color="primary" flat @click="getFamily()">get family</v-btn>
        <v-btn :loading="loading" color="primary" flat @click="addMember('Alberto')" class="ml-4">Add Alberto</v-btn>
      </div>
      <div class="mt-4">
        Familiare: {{ familiareScelto }}
      </div>
      <div class="mt-4">
        top.location.href {{ topLoc }}
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import api from "@/plugins/api"
import { ref } from "vue";
let family = ref([]);
let loading = ref(false);
let familiareScelto = ref("");
const topLoc = ref(top?.location.href);

function getFamily(){
  loading.value = true;
  api.get("family-members").then((res: any) => {
    if (res.success) {
      setTimeout(() => {
        family.value = res.items;
        loading.value = false;

      }, 400)
    }
  })
}
function addMember(name : string){
  loading.value = true;
  api.post("family-members", {jsonData: {name}}).then((res) => {
    if(res.success){
      loading.value = false;
      family.value = res.items;
      console.log(res);
    }
  })
}
</script>
