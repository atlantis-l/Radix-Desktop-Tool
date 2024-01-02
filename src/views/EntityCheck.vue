<template>
  <a-layout class="view-layout" style="overflow: scroll !important">
    <!------------------------ Header ------------------------>
    <a-row class="no-margin-row">
      <a-col span="24">
        <a-input
          allowClear
          ref="address"
          :addonBefore="
            $t(`View.HistoryCheck.template.header.input.addonBefore`)
          "
          :placeholder="
            $t(`View.HistoryCheck.template.header.input.placeholder`)
          "
          v-model:value="address"
        />
      </a-col>
    </a-row>
    <!------------------------ Header ------------------------>

    <a-divider
      >「 {{ $t("View.EntityCheck.template.divider.text") }} 」</a-divider
    >

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <template v-if="data">
        <a-row>
          <a-col span="24">
            <!-- @vue-ignore -->
            <vue-json-pretty showIcon showLength showLineNumber :data="data" />
          </a-col>
        </a-row>
      </template>
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import store from "../stores/store";
import { defineComponent } from "vue";
import "vue-json-pretty/lib/styles.css";
import { message } from "ant-design-vue";
import VueJsonPretty from "vue-json-pretty";
import { RadixNetworkChecker } from "@atlantis-l/radix-tool";

export default defineComponent({
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      address: "",
      store: store(),
      data: undefined as object | undefined,
      networkChecker: new RadixNetworkChecker(store().networkId),
    };
  },
  watch: {
    "store.networkId"() {
      this.networkChecker.networkId = this.store.networkId;
    },
    address() {
      if (this.address.length && this.address.includes("_")) {
        message.loading({
          duration: 0,
          content: `「 ${this.$t(
            "View.EntityCheck.script.message.loading",
          )} 」`,
          key: "checkEntity",
        });
        this.checkEntity();
      }
    },
  },
  methods: {
    checkEntity() {
      this.networkChecker
        .checkEntities([this.address])
        .then((res) => {
          if (res.items && res.items.length) {
            this.data = res.items[0];
          }
          message.success({
            content: `「 ${this.$t(
              "View.EntityCheck.script.message.success",
            )} 」`,
            key: "checkEntity",
          });
        })
        .catch((_e) => {
          message.error({
            content: `「 ${this.$t(
              "View.EntityCheck.script.message.error",
            )} 」`,
            key: "checkEntity",
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

.view-layout-content {
  overflow: scroll !important;
}

.view-layout-content::-webkit-scrollbar {
  display: none !important;
}
</style>
