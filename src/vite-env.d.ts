/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Event {
  keyPath: string[];
}

declare interface RadixTool {
  data: {
    set: (key: string, value: any) => Promise<void>;
    get: (key: string) => Promise<any>;
  };
}
