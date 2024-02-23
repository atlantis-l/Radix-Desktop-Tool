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
          v-model:value.trim="input"
          :placeholder="$t('View.HexConvert.template.input.placeholder')"
        />
      </a-col>
    </a-row>

    <a-row>
      <a-col flex="1">
        <a-tag v-if="!result.length" class="view-max-width result">
          {{ $t("View.HexConvert.template.result.placeholder") }}
        </a-tag>

        <a-tag
          color="purple"
          v-else
          @click="copy(result)"
          class="view-max-width result"
        >
          {{ result }}
        </a-tag>
      </a-col>
    </a-row>

    <a-row>
      <a-col flex="1">
        <a-tag v-if="!u8ArrayStr.length" class="view-max-width result">
          {{ $t("View.HexConvert.template.u8ArrayStr.placeholder") }}
        </a-tag>

        <a-tag
          v-else
          color="purple"
          @click="copy(u8ArrayStr)"
          class="view-max-width result"
        >
          {{ u8ArrayStr }}
        </a-tag>
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
      u8ArrayStr: "",
      store: store(),
    };
  },
  watch: {
    async input(v: string) {
      if (v.length) {
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

          const fromHexString = (hex: string) => {
            const r = hex.match(/.{1,2}/g);
            //@ts-ignore
            return Uint8Array.from(r.map((byte) => parseInt(byte, 16)));
          };

          let hexStr = v;

          if (v.includes("_")) {
            hexStr = this.result;
          }

          const uint8Arr = fromHexString(hexStr) as Uint8Array;

          this.u8ArrayStr = `[${uint8Arr.map((v) => v).join(", ")}]`;
        } catch (_) {
          this.result = "";
          this.u8ArrayStr = "";
        }
      } else {
        this.result = "";
        this.u8ArrayStr = "";
      }
    },
  },
  methods: {
    copy(text: string) {
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

.result {
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  line-height: 32px;
  user-select: none;
  overflow: scroll;
}

.result::-webkit-scrollbar {
  display: none;
}
</style>
