<template>
  <a-modal
    centered
    destroyOnClose
    :title="
      $t(
        `View.TokenTransfer.SingleToMultiple.template.modal.transactionProgress`,
      )
    "
    :width="270"
    :footer="null"
    :maskClosable="closable"
    v-model:open="isOpened"
    style="text-align: center; user-select: none"
  >
    <a-progress
      type="circle"
      :stroke-color="{
        '0%': '#052cc0',
        '50%': '#1dddbf',
        '100%': '#ff00e6',
      }"
      style="margin-top: 8px"
      :status="status"
      :percent="percent"
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    closable: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
  },
  watch: {
    open(v) {
      this.isOpened = v;
    },
    isOpened(v) {
      v ? undefined : this.$emit("close");
    },
  },
  data() {
    return {
      isOpened: false,
    };
  },
});
</script>

<style scoped></style>
