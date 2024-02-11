//@ts-nocheck
import { defineStore } from "pinia";
import zh from "ant-design-vue/es/locale/zh_CN";
import en from "ant-design-vue/es/locale/en_US";
import { NetworkId } from "@atlantis-l/radix-tool";
import CustomWorker from "../workers/customWorker?worker&inline";

const radixTool = window.RadixTool as RadixTool;

const state = {};

state.pageSize = await radixTool.data.get("pageSize");
state.language = await radixTool.data.get("language");
state.networkId = await radixTool.data.get("networkId");
state.mainnetUrl = await radixTool.data.get("mainnetUrl");
state.stokenetUrl = await radixTool.data.get("stokenetUrl");
state.currentPath = await radixTool.data.get("currentPath");
state.showNetwork = await radixTool.data.get("showNetwork");
state.selectedKeys = await radixTool.data.get("selectedKeys");
state.menuFoldState = await radixTool.data.get("menuFoldState");

const MAINNET_DEFAULT_URL = "https://mainnet.radixdlt.com/";

const STOKENET_DEFAULT_URL = "https://stokenet.radixdlt.com/";

if (!state.mainnetUrl.trim().length) {
  state.mainnetUrl = MAINNET_DEFAULT_URL;
}

if (!state.stokenetUrl.trim().length) {
  state.stokenetUrl = STOKENET_DEFAULT_URL;
}

const worker = new CustomWorker();

export default defineStore("store", {
  state: () => ({
    worker,
    radixTool,
    language: state.language,
    pageSize: state.pageSize,
    networkId: state.networkId,
    mainnetUrl: state.mainnetUrl,
    stokenetUrl: state.stokenetUrl,
    showNetwork: state.showNetwork,
    currentPath: state.currentPath,
    selectedKeys: state.selectedKeys,
    menuFoldState: state.menuFoldState,
    mainnetDefaultUrl: MAINNET_DEFAULT_URL,
    stokenetDefaultUrl: STOKENET_DEFAULT_URL,
  }),
  actions: {
    setPageSize(size: number) {
      radixTool.data.set("pageSize", size);
    },
    setNetworkId(id: number) {
      radixTool.data.set("networkId", id);
      this.networkId = id;
    },
    async setLanguage(symbol: string) {
      await radixTool.data.set("language", symbol);
      await radixTool.translate(symbol);
      this.language = symbol;
    },
    setShowNetwork(isShow: boolean) {
      radixTool.data.set("showNetwork", isShow);
      this.showNetwork = isShow;
    },
    setMenuFoldState(state: boolean) {
      radixTool.data.set("menuFoldState", state);
      this.menuFoldState = state;
    },
    setCurrentPath(currentPath: string) {
      radixTool.data.set("currentPath", currentPath);
      this.currentPath = currentPath;
    },
    setNetworkUrl(id: number, url: string) {
      if (id === NetworkId.Mainnet) {
        this.mainnetUrl = url;
        radixTool.data.set("mainnetUrl", url);
      } else if (id === NetworkId.Stokenet) {
        this.stokenetUrl = url;
        radixTool.data.set("stokenetUrl", url);
      }
    },
    setSelectedKeys(selectedKeys: string[]) {
      radixTool.data.set("selectedKeys", selectedKeys);
      this.selectedKeys = selectedKeys;
    },
  },
  getters: {
    locale() {
      return this.language === "en" ? en : zh;
    },
  },
});
