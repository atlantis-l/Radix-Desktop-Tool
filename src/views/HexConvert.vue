<template>
  <a-layout class="view-layout">
    <a-row>
      <a-col flex="1">
        <a-alert
          show-icon
          type="info"
          style="user-select: none"
          :message="$t('View.HexConvert.template.tip')"
        />
      </a-col>
    </a-row>

    <a-row>
      <a-col flex="1">
        <a-input
          allowClear
          ref="input"
          v-model:value="input"
          :placeholder="$t('View.HexConvert.template.input.placeholder')"
        />
      </a-col>
    </a-row>

    <a-row>
      <a-col flex="1">
        <a-input
          readonly
          ref="result"
          @click="copy(result)"
          v-model:value="result"
          style="cursor: pointer"
          :placeholder="$t('View.HexConvert.template.result.placeholder')"
        />
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import store from "../stores/store";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { formatConvert } from "@atlantis-l/radix-tool";

export default defineComponent({
  data() {
    return {
      input: "",
      result: "",
      store: store(),
    };
  },
  watch: {
    async input(v: string) {
      if (v.trim().length) {
        if (v.includes("_")) {
          if (this.store.networkId === 1 && !v.includes("_rdx")) {
            message.error({
              content: `「 ${this.$t("View.HexConvert.template.errorMainnetAddress")} 」`,
              key: "error address",
            });
            return;
          }

          if (this.store.networkId === 2 && !v.includes("_tdx_2_")) {
            message.error({
              content: `「 ${this.$t("View.HexConvert.template.errorStokenetAddress")} 」`,
              key: "error address",
            });
            return;
          }
        }

        try {
          this.result = await formatConvert(v, this.store.networkId);
        } catch (_) {
          this.result = "";
        }
      } else {
        this.result = "";
      }
    },
  },
  methods: {
    copy(text: string) {
      //@ts-ignore
      this.$refs.result.blur();

      if (!text.length) return;

      navigator.clipboard.writeText(text).then(() => {
        message.success({
          content: `「 ${this.$t("View.HistoryCheck.script.copied")} 」`,
          key: "copy",
        });
      });
    },
  },
  activated() {
    setTimeout(() => {
      //@ts-ignore
      this.$refs.input.focus();
    }, 100);
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #fff;
}
</style>
