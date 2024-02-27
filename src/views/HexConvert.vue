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

    <a-row v-if="u8ArrayStr.length">
      <a-col flex="1">
        <a-tooltip>
          <template #title>{{ $t("u8-shu-zu") }}</template>

          <a-tag @click="copy(u8ArrayStr)" class="view-max-width result">
            {{ u8ArrayStr }}
          </a-tag>
        </a-tooltip>
      </a-col>
    </a-row>

    <a-row v-if="hexString.length">
      <a-col flex="1">
        <a-tooltip>
          <template #title>{{ $t("shi-liu-jin-zhi-zi-fu-chuan") }}</template>

          <a-tag @click="copy(hexString)" class="view-max-width result">
            {{ hexString }}
          </a-tag>
        </a-tooltip>
      </a-col>
    </a-row>

    <template v-if="addresses">
      <a-row>
        <a-col flex="1">
          <a-tooltip>
            <template #title>{{ $t("zhu-wang-di-zhi") }}</template>

            <a-tag
              @click="copy(addresses?.mainnet_address as string)"
              class="view-max-width result"
            >
              {{ addresses?.mainnet_address }}
            </a-tag>
          </a-tooltip>
        </a-col>
      </a-row>

      <a-row>
        <a-col flex="1">
          <a-tooltip>
            <template #title>{{ $t("ce-shi-wang-di-zhi") }}</template>

            <a-tag
              @click="copy(addresses?.stokenet_address as string)"
              class="view-max-width result"
            >
              {{ addresses?.stokenet_address }}
            </a-tag>
          </a-tooltip>
        </a-col>
      </a-row>

      <a-row>
        <a-col flex="1">
          <a-tooltip>
            <template #title>{{ $t("mo-ni-qi-di-zhi") }}</template>

            <a-tag
              @click="copy(addresses?.simulator_address as string)"
              class="view-max-width result"
            >
              {{ addresses?.simulator_address }}
            </a-tag>
          </a-tooltip>
        </a-col>
      </a-row>
    </template>
  </a-layout>
</template>

<script lang="ts">
import store from "../stores/store";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { formatConvert } from "@atlantis-l/radix-tool";

interface Addresses {
  mainnet_address: string;
  stokenet_address: string;
  simulator_address: string;
}

export default defineComponent({
  data() {
    return {
      input: "",
      hexString: "",
      u8ArrayStr: "",
      addresses: undefined as undefined | Addresses,
      store: store(),
    };
  },
  watch: {
    async input(v: string) {
      if (v.length) {
        try {
          if (v.includes("_")) {
            this.hexString = (await formatConvert(v)) as string;
            this.addresses = (await formatConvert(this.hexString)) as Addresses;
          } else {
            this.hexString = v;
            this.addresses = (await formatConvert(v)) as Addresses;
          }

          const fromHexString = (hex: string) => {
            const r = hex.match(/.{1,2}/g);
            //@ts-ignore
            return Uint8Array.from(r.map((byte) => parseInt(byte, 16)));
          };

          const uint8Arr = fromHexString(this.hexString) as Uint8Array;

          this.u8ArrayStr = `[${uint8Arr.map((v) => v).join(", ")}]`;
        } catch (_) {
          message.error({
            key: "format",
            content: `「 ${this.$t("ge-shi-cuo-wu")} 」`,
          });

          this.hexString = "";
          this.u8ArrayStr = "";
          this.addresses = undefined;
        }
      } else {
        this.hexString = "";
        this.u8ArrayStr = "";
        this.addresses = undefined;
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
