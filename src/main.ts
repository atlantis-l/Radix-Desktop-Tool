import App from "./App.vue";
import router from "./routes";
import { createApp } from "vue";
import { en, zh } from "./langs";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import "ant-design-vue/dist/reset.css";
import GCWorker from "./workers/gcWorker?worker&inline";

const _ = new GCWorker();

const pinia = createPinia();

//@ts-ignore
const RadixTool: RadixTool = window.RadixTool;

const locale = await RadixTool.data.get("language");

const i18n = createI18n({
  locale: locale,
  messages: { zh, en },
});

createApp(App).use(i18n).use(Antd).use(pinia).use(router).mount("#app");
