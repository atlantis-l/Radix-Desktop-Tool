<template>
  <a-modal centered destroyOnClose :footer="null" v-model:open="isOpened">
    <template v-if="view === 'SingleToMultiple'">
      {{ $t(`View.WalletGenerate.script.address`) }}[,{{
        $t(`View.TokenTransfer.SingleToMultiple.template.content.amount`)
      }}][,NFT ID][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx[,xxxxxx][,xxxxxx][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx[,xxxxxx][,xxxxxx][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx[,xxxxxx][,xxxxxx][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx[,xxxxxx][,xxxxxx][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx[,xxxxxx][,xxxxxx][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />[......]
    </template>

    <template
      v-else-if="view === 'MultipleToSingle' || view === 'ManifestExecute'"
    >
      {{ $t(`View.WalletGenerate.script.address`) }},{{
        $t(`View.WalletGenerate.script.privateKey`)
      }}[,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx,xxxxxx[,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx,xxxxxx[,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx,xxxxxx[,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx,xxxxxx[,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      account_xxxxxx,xxxxxx[,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />[......]
    </template>

    <template v-if="view === 'ManifestExecuteFieldCSV'">
      [NFT ID][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      [......][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      [......][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      [......][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      [......][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />
      [......][,......]({{
        $t("View.TokenTransfer.SingleToMultiple.template.optional")
      }})<br />[......]
    </template>
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
    view: {
      type: String,
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
