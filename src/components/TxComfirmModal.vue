<template>
  <a-modal
    centered
    destroyOnClose
    @ok="emitSendTx"
    v-model:open="isOpened"
    :title="
      $t(
        `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.title`,
      )
    "
  >
    <a-textarea
      allowClear
      ref="textarea"
      v-model:value.trim="message"
      @keyup.ctrl.enter="emitSendTx"
      style="margin: 12px 0 8px 0"
      :autoSize="{ minRows: 10, maxRows: 10 }"
      :placeholder="
        $t(
          `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.placeholder`,
        )
      "
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FOCUS_DELAY } from "../common";

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    open(v) {
      this.isOpened = v;
    },
    isOpened(v) {
      if (v) {
        setTimeout(() => {
          //@ts-ignore
          this.$refs.textarea.focus();
        }, FOCUS_DELAY);
      } else {
        this.$emit("close");
      }
    },
  },
  data() {
    return {
      message: "",
      isOpened: false,
    };
  },
  methods: {
    emitSendTx() {
      this.$emit("sendTx", this.message);
    },
  },
});
</script>

<style scoped></style>
