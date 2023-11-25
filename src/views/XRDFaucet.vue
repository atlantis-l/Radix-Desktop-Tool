<template>
  <a-layout>
    <a-typography-title>
      {{ $t("View.XRDFaucet.message") }}
    </a-typography-title>
  </a-layout>
</template>

<script lang="ts">
import * as prettier from "prettier";
import { defineComponent } from "vue";
import { CreateIcon } from "../common";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";

export default defineComponent({
  components: { CreateIcon },
  data() {
    return {};
  },
});
// prettier
//       .format(JSON.stringify({}), {
//         parser: "json",
//         plugins: [babel, estree],
//       })
//       .then((result) => {
//         console.log(result);
//       });
</script>

<style scoped></style>
