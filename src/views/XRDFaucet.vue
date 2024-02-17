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
          ref="address"
          @keyup.enter="getXRD"
          v-model:value.trim="address"
          :placeholder="$t('View.XRDFaucet.template.stokenetAddress')"
        />
      </a-col>
      <a-col span="4">
        <a-tooltip destroyTooltipOnHide>
          <template #title>
            {{ $t("View.XRDFaucet.template.tooltip.requestTimes") }}
          </template>

          <a-input-number
            :min="1"
            @keyup.enter="getXRD"
            class="view-max-width"
            v-model:value.trim="requestTimes"
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
      if (value.length && value.startsWith("account")) {
        this.getXrdBalance();
      }
    },
    requestTimes(v) {
      if (!v) this.requestTimes = 1;
    },
  },
  methods: {
    async getXRD() {
      if (!this.address.length || !this.address.startsWith("account")) {
        return;
      }

      this.count = 0;

      message.loading({
        duration: 0,
        content: `「 ${this.$t("View.XRDFaucet.script.loading")} 」`,
        key: "getXRD",
      });

      let currentEpoch = await getCurrentEpoch(NetworkId.Stokenet);

      let startTime = Date.now();

      for (let i = 0; i < this.requestTimes; i++) {
        const nowTime = Date.now();

        if (startTime + 1000 * 60 * 5 < nowTime) {
          startTime = nowTime;
          currentEpoch = await getCurrentEpoch(NetworkId.Stokenet);
        }

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
      if (!this.address.length || !this.address.startsWith("account")) {
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
          //Retrieve XRD token information
          const xrd = (
            resourcesOfAccounts.pop() as ResourcesOfAccount
          ).fungible.find((resource) => {
            const xrdAddress = selectXrdAddress(2);
            return resource.resourceAddress === xrdAddress;
          });
          //XRD balance of the deducted wallet
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
  activated() {
    setTimeout(() => {
      //@ts-ignore
      this.$refs.address.focus();
    }, 100);
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #fff;
}
</style>
