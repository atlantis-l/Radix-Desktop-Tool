<template>
  <a-layout>
    <a-typography-title>
      {{ $t("View.TokenCreate.message") }}
    </a-typography-title>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CreateIcon } from "../common";

export default defineComponent({
  components: { CreateIcon },
  data() {
    return {};
  },
});
</script>

<style scoped></style>
