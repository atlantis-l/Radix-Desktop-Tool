<template>
  <a-layout>
    <a-row :gutter="gutter">
      <a-col span="10" class="view-no-padding-left">
        <a-input
          allowClear
          v-model:value="amount"
          @pressEnter="createWallet"
          :addonBefore="$t(`View.WalletGenerate.template.amount`)"
          :placeholder="$t(`View.WalletGenerate.template.placeholder`)"
        />
      </a-col>
      <a-col span="3">
        <a-button
          @click="createWallet"
          class="view-max-width custom-btn"
          :text="$t(`View.WalletGenerate.template.create`)"
        >
          {{ $t(`View.WalletGenerate.template.create`) }}
        </a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <a-statistic
          :value="fileData.data.length"
          :title="$t(`View.WalletGenerate.template.amount`)"
        />
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import Papa from "papaparse";
import { sleep } from "../common";
import FileSaver from "file-saver";
import store from "../stores/store";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { RadixWalletGenerator } from "@atlantis-l/radix-tool";

export default defineComponent({
  data() {
    return {
      amount: "",
      store: store(),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      fileData: {
        fields: [] as string[],
        data: [] as string[][],
      },
    };
  },
  watch: {
    "store.networkId"(id: number) {
      this.walletGenerator.networkId = id;
    },
  },
  computed: {
    gutter() {
      return 10;
    },
  },
  methods: {
    async createWallet() {
      const amount = parseInt(this.amount.trim());

      if (!amount) {
        message.error(`「 ${this.$t(`View.WalletGenerate.script.error`)} 」`);
        return;
      }

      this.fileData.data = [];
      this.fileData.fields = [];

      this.fileData.fields.push(this.$t(`View.WalletGenerate.script.address`));

      this.fileData.fields.push(
        this.$t(`View.WalletGenerate.script.privateKey`),
      );

      for (let i = 0; i < amount; i++) {
        await sleep(i, 9, 1);

        const wallet = await this.walletGenerator.generateNewWallet();

        this.fileData.data.push([wallet.address, wallet.privateKeyHexString()]);
      }

      const result = Papa.unparse(this.fileData);

      FileSaver.saveAs(
        new Blob([result], { type: "text/plain;charset=utf-8" }),
        `${this.$t(`View.WalletGenerate.script.fileName`)}.csv`,
      );
    },
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #ffffff;
}
</style>
