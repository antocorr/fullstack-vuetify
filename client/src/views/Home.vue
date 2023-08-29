<template>
  <div class="pt-12">
    <div class="px-12" style="max-width: 580px; margin: 0 auto">
      <v-combobox label="member" :items="family" item-value="id" item-title="name" v-model="currentMember"></v-combobox>
      <div>
        <v-btn :loading="loading" color="primary" flat @click="getFamily()">get family</v-btn>
      </div>
      <div class="mt-8">
        <div>
          <v-text-field label="name" v-model="familyMember.name" />
          <v-text-field label="surname" v-model="familyMember.surname" />
          <v-combobox label="parent" :items="[{ name: 'none', id: 0 }, ...family]" item-value="id" item-title="name" v-model="familyMember.parent"></v-combobox>
        </div>
        <v-btn :loading="loading" color="primary" flat @click="addMember()">Add Member</v-btn>
      </div>
      <div class="mt-4" v-if="currentMember">
        <div class="my-2">
          id: {{ currentMember.id }}
        </div>
        <div class="my-2">
          Name: {{ currentMember.name }}
        </div>
        <div class="my-2">
          Surname: {{ currentMember.surname }}
        </div>
        <div class="my-2">
          <v-btn :loading="loading" color="error" flat @click="deleteMember()">Delete {{ currentMember.name }}</v-btn>
        </div>
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
type familyMember = {
  name: string, surname: string, parent: number, id:number
}
let family = ref<familyMember[]>([]);
let familyMember: any = ref({ name: "", surname: "", parent: 0 });
let loading = ref(false);
let currentMember = ref<familyMember | null>();
const topLoc = ref(top?.location.href);

function getFamily() {
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
function deleteMember() {
  if(currentMember.value){
    loading.value = true;
    api.delete("family-members/" + currentMember.value.id).then((res: any) => {
      if (res.success) {
        setTimeout(() => {
          loading.value = false;
          family.value = family.value.filter(e => e.id != currentMember.value?.id);
          currentMember.value = null;
        }, 400)
      }
    })
  }
}
function addMember() {
  loading.value = true;
  api.post("family-members", { jsonData: familyMember.value }).then((res) => {
    if (res.success && familyMember.value) {
      loading.value = false;
      familyMember.value.id = res.insertId;
      family.value.push(familyMember.value);
      familyMember.value = {};
      console.log(res);
    }
  })
}
</script>
