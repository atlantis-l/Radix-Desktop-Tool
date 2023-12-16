/// <reference types="vite/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Data {
  action: string;
  args: any[];
}

declare interface Event {
  keyPath: string[];
}

declare interface RadixTool {
  data: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
  translate: (symbol: "en" | "zh") => Promise<void>;
  getFileBuffer: (path: string) => Promise<Buffer>;
  openExternalLink: (url: string) => Promise<void>;
}
