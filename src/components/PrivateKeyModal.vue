<template>
  <a-modal
    centered
    destroyOnClose
    :title="title"
    v-model:open="isOpened"
    @ok="emitAction"
  >
    <a-input
      ref="input"
      showCount
      allowClear
      :addonBefore="
        $t(
          `View.TokenTransfer.MultipleToMultiple.template.feePayerModal.addonBefore`,
        )
      "
      :placeholder="
        $t(
          `View.TokenTransfer.MultipleToMultiple.template.feePayerModal.placeholder`,
        )
      "
      v-model:value.trim="privateKey"
      @keyup.enter="emitAction"
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FOCUS_DELAY } from "../common";
import { Wallet } from "@atlantis-l/radix-tool";

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    wallet: {
      type: null,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  watch: {
    open(v) {
      this.isOpened = v;
    },
    isOpened(v) {
      if (v) {
        if (this.wallet) {
          this.privateKey = (this.wallet as Wallet).privateKeyHexString();
        }
        setTimeout(() => {
          //@ts-ignore
          this.$refs.input.focus();
        }, FOCUS_DELAY);
      } else {
        this.$emit("close");
      }
    },
  },
  data() {
    return {
      isOpened: false,
      privateKey: "",
    };
  },
  methods: {
    emitAction() {
      this.$emit("action", this.privateKey);
    },
  },
});
</script>

<style scoped></style>
