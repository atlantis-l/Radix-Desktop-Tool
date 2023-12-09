<template>
  <a-config-provider :locale="store.locale">
    <a-app>
      <a-layout>
        <!------------------------ Sider ------------------------>
        <a-layout-sider
          :trigger="null"
          :collapsible="true"
          :collapsed="store.menuFoldState"
        >
          <div id="logo">
            <img src="/electron.png" height="56" />
          </div>

          <!------------------------ Menu ------------------------>
          <a-menu
            mode="inline"
            @click="menuClick"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="store.selectedKeys"
          >
            <template v-for="route in $router.options.routes">
              <template v-if="route.children && route.children.length">
                <a-sub-menu
                  :key="route.name"
                  :title="$t(`Menu.${String(route.name)}.title`)"
                >
                  <template #icon>
                    <!-- @vue-ignore -->
                    <CreateIcon :icon="route.icon" />
                  </template>

                  <a-menu-item
                    v-for="child in route.children"
                    :key="child.name"
                  >
                    <template #icon>
                      <!-- @vue-ignore -->
                      <CreateIcon :icon="child.icon" />
                    </template>
                    <!-- @vue-ignore -->
                    <template v-if="child.icons && child.icons.length">
                      <!-- @vue-ignore -->
                      <template v-for="icon in child.icons">
                        <CreateIcon :icon="icon" />
                      </template>
                    </template>
                    <template v-else>
                      <span>{{
                        $t(`Menu.${String(route.name)}.${String(child.name)}`)
                      }}</span>
                    </template>
                  </a-menu-item>
                </a-sub-menu>
              </template>

              <template v-else>
                <a-menu-item :key="route.name">
                  <template #icon>
                    <!-- @vue-ignore -->
                    <CreateIcon :icon="route.icon" />
                  </template>
                  <span>{{ $t(`Menu.${String(route.name)}.title`) }}</span>
                </a-menu-item>
              </template>
            </template>
          </a-menu>
          <!------------------------ Menu ------------------------>
        </a-layout-sider>
        <!------------------------ Sider ------------------------>

        <a-layout>
          <!------------------------ Header ------------------------>
          <a-layout-header class="a-layout-header">
            <a-row>
              <a-col>
                <div id="trigger">
                  <CreateIcon
                    class="trigger"
                    :icon="triggerIcon"
                    @click="menufold"
                  />
                </div>
              </a-col>

              <a-col flex="1">
                <a-breadcrumb class="a-breadcrumb">
                  <template v-for="name in path">
                    <a-breadcrumb-item>
                      {{ name }}
                    </a-breadcrumb-item>
                  </template>
                </a-breadcrumb>
              </a-col>

              <a-col>
                <a-select
                  class="a-select"
                  :options="options"
                  @change="store.setNetworkId"
                  v-model:value="store.networkId"
                />
              </a-col>
            </a-row>
          </a-layout-header>
          <!------------------------ Header ------------------------>

          <!------------------------ Content ------------------------>
          <a-layout-content class="a-layout-content">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <KeepAlive>
                  <component :is="Component" />
                </KeepAlive>
              </transition>
            </router-view>
          </a-layout-content>
          <!------------------------ Content ------------------------>
        </a-layout>
      </a-layout>

      <!------------------------ Translate Button ------------------------>
      <a-float-button
        type="primary"
        class="a-float-button"
        :onClick="selectLanguage"
      >
        <template #icon>
          <CreateIcon icon="TranslationOutlined" />
        </template>
      </a-float-button>
      <!------------------------ Translate Button ------------------------>
    </a-app>
  </a-config-provider>
</template>

<script lang="ts">
import store from "./stores/store";
import { defineComponent } from "vue";
import { CreateIcon } from "./common";
import { message } from "ant-design-vue";

export default defineComponent({
  components: { CreateIcon },
  data() {
    return {
      store: store(),
      openKeys: undefined,
    };
  },
  computed: {
    path() {
      return this.$route.matched.map((location, index, array) => {
        return !index
          ? //@ts-ignore
            this.$t(`Menu.${String(location.name)}.title`)
          : this.$t(
              this.$t(
                "menu-string-array-toreversed-pop-name-string-location-name",
                //@ts-ignore
                [String(array.toReversed().pop().name), String(location.name)],
              ),
            );
      });
    },
    options() {
      return [
        { value: 1, label: this.$t("Network.mainnet") },
        { value: 2, label: this.$t("Network.stokenet") },
      ];
    },
    triggerIcon() {
      return this.store.menuFoldState
        ? "MenuUnfoldOutlined"
        : "MenuFoldOutlined";
    },
  },
  mounted() {
    //子菜单延时展开
    setTimeout(() => {
      //子菜单开闭
      !this.store.menuFoldState && this.setOpenKeys();
    }, 200);
  },
  methods: {
    //左侧菜单事件
    menuClick(event: Event) {
      //生成路由路径
      const path = `/${event.keyPath.join("/")}`;
      //路由切换
      this.$router.push(path).then(() => {
        //子菜单开闭
        !this.store.menuFoldState && this.setOpenKeys();
      });
      //存储全局路由路径
      this.store.setCurrentPath(path);
      //存储全局菜单选中项
      this.store.setSelectedKeys(event.keyPath);
    },
    //菜单折叠
    menufold() {
      this.store.setMenuFoldState(!this.store.menuFoldState);
      !this.store.menuFoldState && this.setOpenKeys();
    },
    //子菜单开闭
    setOpenKeys() {
      let openKeys = this.$route.path.split("/");
      //@ts-ignore
      this.openKeys = openKeys.slice(1, openKeys.length - 1);
    },
    //语言选择
    selectLanguage() {
      const language = this.store.language === "en" ? "zh" : "en";
      this.store.setLanguage(language);
      this.$i18n.locale = language;
      message.success(
        language === "en"
          ? this.$t("current-language-english")
          : this.$t("dang-qian-yu-yan-zhong-wen"),
      );
    },
  },
});
</script>

<style>
/* ************************* Global ************************* */

@font-face {
  font-family: "PingFangSC-Regular";
  src: url("PingFangSC-Regular.woff2") format("woff2");
  font-display: block;
}

@font-face {
  font-family: "SF-Mono-Regular";
  src: url("SF-Mono-Regular.woff2") format("woff2");
  font-display: block;
}

* {
  font-family: "PingFangSC-Regular" !important;
}

textarea {
  font-family: "SF-Mono-Regular" !important;
}

textarea::-webkit-scrollbar {
  display: none !important;
}

.cet-container {
  overflow: unset !important;
}

.ant-tooltip-inner {
  max-height: 20vh !important;
  overflow: scroll !important;
}

.ant-tooltip-inner::-webkit-scrollbar {
  display: none !important;
}

.ant-row {
  margin: 0 0 20px 0 !important;
}

.ant-divider {
  margin: 9px 0 !important;
}

.ant-upload-list {
  display: none !important;
}

.ant-card-body {
  padding: 20px !important;
}

.ant-card-head {
  cursor: pointer !important;
  text-align: center !important;
  user-select: none !important;
  background-color: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
  transition: all 0.3s ease-in-out;
}

.ant-card-head:hover {
  color: #531dab;
}

.ant-statistic {
  user-select: none !important;
}

.ant-statistic-content {
  font-size: 18px !important;
}

.ant-upload-select {
  display: block !important;
}

.ant-notification {
  user-select: none !important;
}

.ant-input-group-addon {
  user-select: none !important;
}

.ant-select-selection-item {
  color: #000000 !important;
}

.ant-divider-inner-text {
  user-select: none !important;
}

.view-layout {
  max-height: 100% !important;
}

.view-layout::-webkit-scrollbar {
  display: none !important;
}

.view-50vh-max-height {
  padding: 9px !important;
  min-height: 50vh !important;
  overflow: scroll !important;
  max-height: 50vh !important;
  margin: 20px 0 0 0 !important;
  border-radius: 8px !important;
  border: 1px dashed #d9d9d9 !important;
}

.view-50vh-max-height::-webkit-scrollbar {
  display: none !important;
}

.view-nft-selector-label .ant-select-selector {
  border: 1px solid #d9d9d9 !important;
  background-color: rgba(0, 0, 0, 0.02) !important;
}

.view-centered-col {
  text-align: center !important;
}

.view-ended-col {
  text-align: end !important;
}

.view-no-padding-left {
  padding-left: 0 !important;
}

.view-no-padding-right {
  padding-right: 0 !important;
}

.view-max-width {
  width: 100% !important;
}

.custom-btn {
  color: #ff0000;
  transition: all 0.3s;
  animation-duration: 30s;
  background-size: 320px 320px;
  background-position: 75% 60%;
  animation-play-state: paused;
  animation-name: radix-animation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  border: 1px solid transparent !important;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(to left, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
}

.custom-btn:hover {
  color: #1dddbf !important;
  animation-play-state: running;
}

.custom-btn::before {
  color: #000000;
  position: absolute;
  content: attr(text);
  mask: linear-gradient(to left, transparent, white);
  -webkit-mask: linear-gradient(to left, transparent, white);
}
/* ************************* Global ************************* */

/* ************************* App.vue ************************* */
#logo {
  text-align: center !important;
  margin: 15px 0 11px 0 !important;
}

.a-float-button {
  right: 30px !important;
  bottom: 30px !important;
}

.ant-float-btn-body {
  transition: box-shadow 0.4s !important;
  box-shadow: 0 0 7px #40549d !important;
  background-image: linear-gradient(35deg, #1dddbf, #052cc0) !important;
}

.ant-float-btn-body:hover {
  box-shadow: 7px 7px 17px #40549d !important;
}

body {
  display: flex !important;
}

.cet-container {
  display: flex !important;
  flex-direction: column !important;
}

#app {
  flex: 1 !important;
  height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

.ant-app {
  flex: 1 !important;
  height: 0 !important;
  display: flex !important;
}

.ant-layout-sider {
  user-select: none !important;
  background-color: #22272e !important;
}

.ant-layout-sider-children {
  display: flex !important;
  flex-direction: column !important;
}

.a-layout-header {
  padding: 0 24px 0 0 !important;
  background: #ffffff !important;
  border-bottom: 1px solid #d0d0d0 !important;
  box-shadow: 0px 0px 15px #ceccce !important;
}

#trigger {
  top: 1px !important;
  padding: 0 22.5px !important;
  position: relative !important;
}

.ant-layout-header .trigger {
  font-size: 18px;
  transition: transform 0.3s;
  cursor: pointer !important;
}

.ant-layout-header .trigger:hover {
  transform: scale(1.3);
}

.a-breadcrumb {
  font-size: 15px !important;
  user-select: none !important;
  padding-top: 19.5px !important;
}

.a-select {
  width: 110px !important;
}

@keyframes radix-animation {
  0% {
    background-position: 75% 60%;
  }
  11% {
    background-position: 100% 100%;
  }
  22% {
    background-position: 50% 75%;
  }
  33% {
    background-position: 0% 100%;
  }
  44% {
    background-position: 25% 50%;
  }
  55% {
    background-position: 0% 0%;
  }
  66% {
    background-position: 50% 25%;
  }
  77% {
    background-position: 100% 0%;
  }
  88% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 75% 60%;
  }
}

.a-layout-content {
  margin: 23px !important;
  display: flex !important;
  padding: 24px !important;
  background-position: 70% 80%;
  border-radius: 8px !important;
  background-size: 1200px 1200px;
  background-clip: padding-box, border-box;
  border: 1px solid transparent !important;
  box-shadow: 0px 0px 15px #ceccce !important;
  background-image: linear-gradient(to right, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
}

.a-layout-content::-webkit-scrollbar {
  display: none !important;
}

.ant-menu {
  color: #ffffff !important;
  overflow: scroll !important;
  background-color: #22272e !important;
}

.ant-menu::-webkit-scrollbar {
  display: none !important;
}

.ant-menu-submenu-selected .ant-menu-submenu-title {
  color: white !important;
  background-color: #00000055 !important;
}

.ant-menu-item-selected,
.ant-menu-item:not(.ant-menu-item-selected):hover,
.ant-menu-submenu-title:hover:not(.ant-menu-submenu-selected) {
  color: white !important;
  background-color: #000000 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out !important;
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0 !important;
}
/* ************************* App.vue ************************* */
</style>
