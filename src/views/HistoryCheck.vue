<template>
  <a-layout class="view-layout">
    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter" class="no-margin-row">
      <a-col span="12" class="view-no-padding-left">
        <a-input
          allowClear
          :addonBefore="
            $t(`View.HistoryCheck.template.header.input.addonBefore`)
          "
          :placeholder="
            $t(`View.HistoryCheck.template.header.input.placeholder`)
          "
          v-model:value="address"
        />
      </a-col>

      <a-col span="4">
        <a-select class="view-max-width" v-model:value="selectedValue">
          <a-select-option :value="10">
            10 {{ $t("View.HistoryCheck.template.header.perPage") }}
          </a-select-option>
          <a-select-option :value="20">
            20 {{ $t("View.HistoryCheck.template.header.perPage") }}
          </a-select-option>
          <a-select-option :value="50">
            50 {{ $t("View.HistoryCheck.template.header.perPage") }}
          </a-select-option>
          <a-select-option :value="100">
            100 {{ $t("View.HistoryCheck.template.header.perPage") }}
          </a-select-option>
        </a-select>
      </a-col>

      <a-col span="4">
        <a-button
          @click="getPreviousPage"
          class="view-max-width custom-btn"
          :text="$t('View.HistoryCheck.template.header.previous')"
        >
          {{ $t("View.HistoryCheck.template.header.previous") }}
        </a-button>
      </a-col>
      <a-col span="4" class="view-no-padding-right">
        <a-button
          @click="getNextPage"
          class="view-max-width custom-btn"
          :text="$t('View.HistoryCheck.template.header.next')"
        >
          {{ $t("View.HistoryCheck.template.header.next") }}
        </a-button>
      </a-col>
    </a-row>
    <!------------------------ Header ------------------------>

    <a-divider>
      {{ $t(`View.HistoryCheck.template.divider.text`) }}
    </a-divider>
  </a-layout>
</template>

<script lang="ts">
import store from "../stores/store";
import { defineComponent } from "vue";
import { CreateIcon } from "../common";
import { message } from "ant-design-vue";
import { selectNetwork } from "@atlantis-l/radix-tool";
import { CommittedTransactionInfo } from "@radixdlt/babylon-gateway-api-sdk";

export default defineComponent({
  components: { CreateIcon },
  data() {
    return {
      gutter: 10,
      address: "",
      store: store(),
      selectedValue: 10,
      currentCursor: undefined as string | undefined,
      cursorList: [] as string[],
      transactionList: undefined as CommittedTransactionInfo[] | undefined,
    };
  },
  watch: {
    address() {
      if (this.address.trim().length) {
        this.getTransactionList();
      } else {
        this.currentCursor = undefined;
        this.cursorList = [];
      }
    },
    selectedValue() {
      this.address.trim().length && this.getTransactionList();
    },
  },
  computed: {
    NETWORK_API() {
      return selectNetwork(this.store.networkId);
    },
  },
  methods: {
    getNextPage() {
      if (!this.address.trim().length) return;

      if (this.currentCursor) {
        const index = this.cursorList.indexOf(this.currentCursor);

        const nextCursor = this.cursorList[index + 1];

        if (nextCursor) {
          this.getTransactionList(nextCursor);
        } else {
          message.info({
            content: `「 ${this.$t("View.HistoryCheck.script.noNext")} 」`,
            key: "noNext",
          });
        }
      } else if (this.cursorList.length) {
        this.getTransactionList(this.cursorList[0]);
      } else {
        message.info({
          content: `「 ${this.$t("View.HistoryCheck.script.noNext")} 」`,
          key: "noNext",
        });
      }
    },
    getPreviousPage() {
      if (!this.address.trim().length) return;
      
      if (this.currentCursor) {
        const index = this.cursorList.indexOf(this.currentCursor);

        const previousCursor = this.cursorList[index - 1];

        if (previousCursor) {
          this.getTransactionList(previousCursor);
        } else {
          this.getTransactionList();
        }
      } else {
        message.info({
          content: `「 ${this.$t("View.HistoryCheck.script.noPrevious")} 」`,
          key: "noPrevious",
        });
      }
    },
    getTransactionList(cursor?: string) {
      const key = cursor ? cursor : "getTransactionList";

      message.loading({
        content: `「 ${this.$t("View.HistoryCheck.script.getTxList")} 」`,
        key,
      });

      this.NETWORK_API.stream.innerClient
        .streamTransactions({
          streamTransactionsRequest: {
            cursor: cursor,
            limit_per_page: this.selectedValue,
            affected_global_entities_filter: [this.address.trim()],
            opt_ins: {
              balance_changes: true,
            },
          },
        })
        .then((res) => {
          if (cursor) {
            this.currentCursor = cursor;
          } else {
            this.cursorList = [];
            this.currentCursor = undefined;
          }

          if (res.next_cursor && !this.cursorList.includes(res.next_cursor)) {
            this.cursorList.push(res.next_cursor);
          }

          this.transactionList = res.items;

          message.success({
            content: `「 ${this.$t("View.HistoryCheck.script.gotTxList")} 」`,
            key,
          });
        })
        .catch(() => {
          message.error({
            content: `「 ${this.$t("View.HistoryCheck.script.txListError")} 」`,
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

.no-margin-row {
  margin: 0 !important;
}
</style>
