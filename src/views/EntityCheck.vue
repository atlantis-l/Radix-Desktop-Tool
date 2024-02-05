<template>
  <a-layout class="view-layout">
    <!------------------------ Header ------------------------>
    <a-row class="no-margin-row" :gutter="gutter">
      <a-col span="20" class="view-no-padding-left">
        <a-input
          allowClear
          ref="address"
          :placeholder="
            $t(`View.HistoryCheck.template.header.input.placeholder`)
          "
          @keyup.enter="check"
          v-model:value.trim="address"
        />
      </a-col>
      <a-col span="4" class="view-no-padding-right">
        <a-button
          class="view-max-width custom-btn"
          :text="$t('View.EntityCheck.template.check')"
          @click="check"
          >{{ $t("View.EntityCheck.template.check") }}</a-button
        >
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
            <!-- @vue-skip -->
            <vue-json-pretty
              id="json"
              showIcon
              showLength
              showLineNumber
              :data="data"
              v-if="show"
            />
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
      gutter: 10,
      show: true,
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
      this.check();
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
    check() {
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
  activated() {
    setTimeout(() => {
      this.show = true;
      //@ts-ignore
      this.$refs.address.focus();
    }, 100);
  },
  beforeRouteLeave() {
    this.show = false;
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
