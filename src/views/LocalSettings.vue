<template>
  <a-layout class="view-layout">
    <a-row :gutter="24">
      <a-col flex="1" class="view-no-padding-left">
        <div class="view-card">
          <a-card class="view-max-width">
            <template #title>{{
              $t("View.LocalSettings.template.gateway")
            }}</template>
            <template #extra>
              <a-button
                @click="restoreNetwork"
                class="custom-btn"
                :text="$t('View.LocalSettings.template.button.restore')"
              >
                {{ $t("View.LocalSettings.template.button.restore") }}
              </a-button>
            </template>
            <a-input
              allowClear
              :addonBefore="$t('Network.mainnet')"
              :placeholder="
                $t('View.TokenCreate.template.content.iconUrlPlaceholder')
              "
              style="margin-bottom: 20px"
              v-model:value.trim="mainnetUrl"
            />

            <a-input
              allowClear
              :addonBefore="$t('Network.stokenet')"
              :placeholder="
                $t('View.TokenCreate.template.content.iconUrlPlaceholder')
              "
              v-model:value.trim="stokenetUrl"
            />
          </a-card>
        </div>
      </a-col>

      <a-col flex="1" class="view-no-padding-right">
        <div class="view-card">
          <a-card class="view-max-width">
            <template #title>{{
              $t("View.LocalSettings.template.language")
            }}</template>
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  $t("View.LocalSettings.template.currentLanguage")
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="[
                  { label: 'English', value: 'en' },
                  { label: '中文', value: 'zh' },
                ]"
                v-model:value="language"
              />
            </a-input-group>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import store from "../stores/store";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { setNetwork, NetworkId } from "@atlantis-l/radix-tool";

export default defineComponent({
  data() {
    return {
      store: store(),
      language: store().language,
      mainnetUrl: store().mainnetUrl,
      stokenetUrl: store().stokenetUrl,
    };
  },
  watch: {
    language() {
      this.store.setLanguage(this.language);
      this.$i18n.locale = this.language;

      message.success(
        this.language === "en"
          ? this.$t("current-language-english")
          : this.$t("dang-qian-yu-yan-zhong-wen"),
      );
    },
    mainnetUrl() {
      setNetwork(NetworkId.Mainnet, false, this.mainnetUrl);
      this.store.setNetworkUrl(NetworkId.Mainnet, this.mainnetUrl);
    },
    stokenetUrl() {
      setNetwork(NetworkId.Stokenet, false, this.stokenetUrl);
      this.store.setNetworkUrl(NetworkId.Stokenet, this.stokenetUrl);
    },
  },
  methods: {
    restoreNetwork() {
      this.mainnetUrl = this.store.mainnetDefaultUrl;
      this.stokenetUrl = this.store.stokenetDefaultUrl;
    },
  },
  deactivated() {
    if (!this.mainnetUrl.length) {
      this.mainnetUrl = this.store.mainnetDefaultUrl;
    }
    if (!this.stokenetUrl.length) {
      this.stokenetUrl = this.store.stokenetDefaultUrl;
    }
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #fff;
}

.view-nft-selector {
  flex: 1 !important;
}

.view-nft-selector-label {
  cursor: default !important;
}

.ant-card {
  background-position: 70% 45%;
  border-radius: 8px !important;
  background-size: 1200px 1200px;
  border: 1px solid #d9d9d9 !important;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(to right, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
  transition: all 0.4s ease;
}

.ant-card:hover {
  background-position: 70% 45%;
  border-radius: 8px !important;
  background-size: 1200px 1200px;
  background-clip: padding-box, border-box;
  border: 1px solid transparent !important;
  background-image: linear-gradient(to right, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
}
</style>
