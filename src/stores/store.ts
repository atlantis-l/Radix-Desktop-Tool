//@ts-nocheck
import { defineStore } from "pinia";
import zh from "ant-design-vue/es/locale/zh_CN";
import en from "ant-design-vue/es/locale/en_US";
import CustomWorker from "../workers/customWorker?worker&inline";

const radixTool: RadixTool = window.RadixTool;

const state = {};

state.simTx = await radixTool.data.get("simTx");
state.pageSize = await radixTool.data.get("pageSize");
state.language = await radixTool.data.get("language");
state.networkId = await radixTool.data.get("networkId");
state.currentPath = await radixTool.data.get("currentPath");
state.showNetwork = await radixTool.data.get("showNetwork");
state.selectedKeys = await radixTool.data.get("selectedKeys");
state.menuFoldState = await radixTool.data.get("menuFoldState");

const worker = new CustomWorker();

export default defineStore("store", {
  state: () => ({
    worker,
    radixTool,
    simTx: state.simTx,
    language: state.language,
    pageSize: state.pageSize,
    networkId: state.networkId,
    showNetwork: state.showNetwork,
    currentPath: state.currentPath,
    selectedKeys: state.selectedKeys,
    menuFoldState: state.menuFoldState,
  }),
  actions: {
    setSimTx(flag: boolean) {
      radixTool.data.set("simTx", flag);
    },
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
