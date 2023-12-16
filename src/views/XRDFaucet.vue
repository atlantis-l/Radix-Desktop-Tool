<template>
  <a-layout class="view-layout">
    <a-row>
      <a-col flex="1">
        <a-alert
          show-icon
          type="info"
          style="user-select: none"
          :message="$t('View.XRDFaucet.template.alert.message')"
        />
      </a-col>
    </a-row>

    <a-row :gutter="10">
      <a-col span="16" class="view-no-padding-left">
        <a-input
          allowClear
          v-model:value="address"
          :addonBefore="$t('View.XRDFaucet.template.address')"
          :placeholder="$t('View.XRDFaucet.template.stokenetAddress')"
        />
      </a-col>
      <a-col span="4">
        <a-tooltip>
          <template #title>
            {{ $t("View.XRDFaucet.template.tooltip.requestTimes") }}
          </template>

          <a-input-number
            @pressEnter="getXRD"
            class="view-max-width"
            v-model:value="requestTimes"
          />
        </a-tooltip>
      </a-col>
      <a-col span="4" class="view-no-padding-right">
        <a-button
          @click="getXRD"
          class="view-max-width custom-btn"
          :text="$t('View.XRDFaucet.template.getXRD')"
          >{{ $t("View.XRDFaucet.template.getXRD") }}</a-button
        >
      </a-col>
    </a-row>

    <a-row>
      <a-col span="6">
        <a-statistic
          :title="$t('View.XRDFaucet.template.requestCount')"
          :value="count"
        />
      </a-col>

      <a-col>
        <a-statistic
          :title="$t('View.XRDFaucet.template.requestXrdAmount')"
          :value="requestTimes * 10000"
        />
      </a-col>
    </a-row>

    <a-row>
      <a-col>
        <a-statistic
          style="cursor: pointer"
          @click="getXrdBalance"
          :title="$t('View.XRDFaucet.template.xrdBalance')"
          :value="xrdBalance"
        />
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import {
  XRDFaucet,
  NetworkId,
  getCurrentEpoch,
  ResourcesOfAccount,
  RadixNetworkChecker,
} from "@atlantis-l/radix-tool";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { selectXrdAddress } from "../common";

export default defineComponent({
  data() {
    return {
      count: 0,
      address: "",
      xrdBalance: "0",
      requestTimes: 1,
      networkChecker: new RadixNetworkChecker(NetworkId.Stokenet),
    };
  },
  watch: {
    address(value: string) {
      if (value.trim().length && value.trim().startsWith("account")) {
        this.getXrdBalance();
      }
    },
  },
  methods: {
    async getXRD() {
      if (
        !this.address.trim().length ||
        !this.address.trim().startsWith("account")
      ) {
        return;
      }

      this.count = 0;

      message.loading({
        duration: 0,
        content: `「 ${this.$t("View.XRDFaucet.script.loading")} 」`,
        key: "getXRD",
      });

      const currentEpoch = await getCurrentEpoch(NetworkId.Stokenet);

      for (let i = 0; i < this.requestTimes; i++) {
        await XRDFaucet.getXRD(this.address, currentEpoch);
        this.count++;
      }

      setTimeout(() => {
        message.success({
          content: `「 ${this.$t("View.XRDFaucet.script.success")} 」`,
          key: "getXRD",
        });

        this.getXrdBalance();
      }, 5000);
    },
    getXrdBalance() {
      if (
        !this.address.trim().length ||
        !this.address.trim().startsWith("account")
      ) {
        return;
      }

      const key = "XRD Balance";

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.getXrdBalance.loading`,
        )} 」`,
        key,
      });

      this.networkChecker
        .checkResourcesOfAccounts([this.address])
        .then((resourcesOfAccounts) => {
          //检索XRD代币信息
          const xrd = (
            resourcesOfAccounts.pop() as ResourcesOfAccount
          ).fungible.find((resource) => {
            const xrdAddress = selectXrdAddress(2);
            return resource.resourceAddress === xrdAddress;
          });
          //扣费钱包的XRD余额
          this.xrdBalance = xrd ? (xrd.amount as string) : "0";

          message.success({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.getXrdBalance.success`,
            )} 」`,
            key,
          });
        });
    },
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #fff;
}
</style>
