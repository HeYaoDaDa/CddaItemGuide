<template>
  <q-input dark dense standout v-model="content" class="q-ml-md" @keyup.enter.exact="search">
    <template v-slot:prepend>
      <q-icon v-if="content != ''" name="clear" class="cursor-pointer" @click="content = ''" />
    </template>
    <template v-slot:append>
      <q-icon name="search" @click="search" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { myLogger } from 'src/boot/logger';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const content = ref('');
const $router = useRouter();

function search() {
  if (content.value.length > 0)
    $router.push({ name: 'search', query: { content: content.value } }).catch((e) => myLogger.error(e));
}
</script>
