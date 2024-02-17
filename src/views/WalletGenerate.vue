<template>
  <a-layout class="view-layout">
    <div style="height: 90px" />

    <a-row justify="center">
      <a-col span="7">
        <a-input-number
          class="view-max-width"
          ref="amount"
          :min="1"
          v-model:value.trim="amount"
          @keyup.enter="createWallet"
          :placeholder="$t(`View.WalletGenerate.template.placeholder`)"
        />
      </a-col>
    </a-row>

    <div style="height: 10px" />

    <a-row justify="center">
      <a-col span="3">
        <a-button
          @click="createWallet"
          class="view-max-width custom-btn"
          :text="$t(`View.WalletGenerate.template.create`)"
          >{{ $t(`View.WalletGenerate.template.create`) }}
        </a-button>
      </a-col>
    </a-row>

    <div style="height: 30px" />

    <a-row justify="center">
      <a-col>
        <a-tag
          style="font-size: 24px; padding: 10px; user-select: none"
          color="blue"
          >{{ $t(`View.WalletGenerate.template.amount`) }}</a-tag
        >
      </a-col>
    </a-row>

    <a-row justify="center">
      <a-col>
        <a-tag style="font-size: 24px; padding: 10px; user-select: none">{{
          fileData.data.length
        }}</a-tag>
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
      amount: 1,
      store: store(),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      fileData: {
        fields: [] as string[],
        data: [] as string[][],
      },
    };
  },
  watch: {
    amount(v) {
      if (!v) this.amount = 1;
    },
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
      const amount = Math.floor(this.amount);

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
  activated() {
    setTimeout(() => {
      //@ts-ignore
      this.$refs.amount.focus();
    }, 100);
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #ffffff;
}
</style>
