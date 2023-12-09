//@ts-nocheck
import { defineStore } from "pinia";
import zh from "ant-design-vue/es/locale/zh_CN";
import en from "ant-design-vue/es/locale/en_US";
import CustomWorker from "../workers/customWorker?worker&inline";

const RadixTool: RadixTool = window.RadixTool;

const state = {};

state.simTx = await RadixTool.data.get("simTx");
state.pageSize = await RadixTool.data.get("pageSize");
state.language = await RadixTool.data.get("language");
state.networkId = await RadixTool.data.get("networkId");
state.currentPath = await RadixTool.data.get("currentPath");
state.showNetwork = await RadixTool.data.get("showNetwork");
state.selectedKeys = await RadixTool.data.get("selectedKeys");
state.menuFoldState = await RadixTool.data.get("menuFoldState");

const worker = new CustomWorker();

export default defineStore("store", {
  state: () => ({
    worker,
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
      RadixTool.data.set("simTx", flag);
    },
    setPageSize(size: number) {
      RadixTool.data.set("pageSize", size);
    },
    setNetworkId(id: number) {
      RadixTool.data.set("networkId", id);
      this.networkId = id;
    },
    async setLanguage(symbol: string) {
      await RadixTool.data.set("language", symbol);
      await RadixTool.translate(symbol);
      this.language = symbol;
    },
    setShowNetwork(isShow: boolean) {
      RadixTool.data.set("showNetwork", isShow);
      this.showNetwork = isShow;
    },
    setMenuFoldState(state: boolean) {
      RadixTool.data.set("menuFoldState", state);
      this.menuFoldState = state;
    },
    setCurrentPath(currentPath: string) {
      RadixTool.data.set("currentPath", currentPath);
      this.currentPath = currentPath;
    },
    setSelectedKeys(selectedKeys: string[]) {
      RadixTool.data.set("selectedKeys", selectedKeys);
      this.selectedKeys = selectedKeys;
    },
  },
  getters: {
    locale() {
      return this.language === "en" ? en : zh;
    },
  },
});
