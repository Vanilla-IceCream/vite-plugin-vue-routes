<script lang="ts" setup>
import { checked } from './store';
</script>

<template>
  <div style="background-color: darkviolet; color: white">
    <div>layouts/Violet.vue.vue</div>
    Value: <input type="checkbox" v-model="checked" />
    <slot></slot>
  </div>
</template>
